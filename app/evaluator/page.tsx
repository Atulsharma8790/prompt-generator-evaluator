'use client'
import { ScoreBar, OverallScoreBadge } from '@/components/ScoreBar'
import { CopyButton } from '@/components/CopyButton'
import { triggerPasscodeCheck } from '@/components/PasscodeModal'
import { useLab } from '@/lib/LabContext'
import { StopButton } from '@/components/StopButton'

const EXAMPLES = [
  { label: 'Weak prompt',   text: 'You are a helpful assistant. Answer the user.' },
  { label: 'Medium prompt', text: "You are a customer support agent. Help users with their questions about our product. Be polite and professional. If you don't know the answer, say so." },
  { label: 'Strong prompt', text: "You are a Tier-1 customer support specialist for Acme SaaS. Your role is to resolve billing, account, and technical issues efficiently while maintaining a warm, professional tone.\n\nGuidelines:\n- Acknowledge the customer's concern first before diving into solutions\n- Ask one clarifying question at a time if details are missing\n- For billing disputes: collect order ID, describe the issue, then escalate to billing@acme.com\n- For technical issues: request browser, OS, and steps to reproduce\n- Never promise refunds or credits without manager approval\n- End each response with a clear next step or confirmation question\n\nOutput format: Plain prose. No bullet points unless listing steps. Keep responses under 150 words." },
]

export default function EvaluatorPage() {
  const { eval_, setEval_, activeTask, setActiveTask, abortRef } = useLab()
  const { prompt, result, loading, error } = eval_

  const evaluate = async () => {
    if (!prompt.trim()) return
    if (activeTask && activeTask !== 'evaluator') return
    const ok = await triggerPasscodeCheck()
    if (!ok) return
    setEval_({ loading: true, error: '', result: null })
    setActiveTask('evaluator')
    const ctrl = new AbortController()
    abortRef.current = ctrl
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: ctrl.signal,
      })
      const data = await res.json()
      if (!res.ok) { setEval_({ error: data.error }); return }
      setEval_({ result: data })
    } catch (e) {
      if ((e as Error).name !== 'AbortError')
        setEval_({ error: 'Network error — is the server running?' })
    } finally {
      setEval_({ loading: false })
      setActiveTask(null)
      abortRef.current = null
    }
  }

  const otherRunning = activeTask && activeTask !== 'evaluator'

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>🔬</div>
          <h1 className="text-2xl font-black text-white">Prompt Evaluator</h1>
        </div>
        <p className="text-[#7B8FA8] text-sm ml-[52px]">Paste any prompt → get scored across 6 quality dimensions with actionable fixes.</p>
      </div>

      {otherRunning && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm text-amber-300 flex items-center gap-2"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          ⚠ Another tool is currently running. Please wait for it to finish before evaluating.
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        {/* ── Left: Input ── */}
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <div>
              <p className="label mb-2">Quick Examples</p>
              <div className="flex gap-2 flex-wrap">
                {EXAMPLES.map(ex => (
                  <button key={ex.label} onClick={() => setEval_({ prompt: ex.text, result: null })}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', color: '#C4B5FD' }}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Your Prompt *</label>
              <textarea className="input" rows={12}
                placeholder="Paste the system prompt or full prompt you want evaluated..."
                value={prompt}
                onChange={e => setEval_({ prompt: e.target.value })} />
              <p className="text-[#475569] text-xs mt-1.5">{prompt.length} characters</p>
            </div>

            <div className="flex gap-2">
              <button onClick={evaluate} disabled={loading || !prompt.trim() || !!otherRunning}
                className={`btn btn-purple ${loading ? 'flex-[3]' : 'w-full'}`}>
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent spin" /> Evaluating...</>
                  : '🔬 Evaluate Prompt'}
              </button>
              {loading && <StopButton task="evaluator" />}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* ── Right: Results ── */}
        <div>
          {!result && !loading && (
            <div className="card p-12 flex flex-col items-center justify-center text-center" style={{ minHeight: '350px' }}>
              <div className="text-4xl mb-3">🔬</div>
              <p className="text-[#475569] text-sm">Evaluation results will appear here.</p>
              <p className="text-[#334155] text-xs mt-1">Try one of the quick examples to see it in action.</p>
            </div>
          )}
          {loading && (
            <div className="card p-12 flex flex-col items-center justify-center" style={{ minHeight: '350px' }}>
              <div className="w-10 h-10 rounded-full border-2 border-[#A855F7] border-t-transparent spin mb-4" />
              <p className="text-[#6B7F96] text-sm">Analysing your prompt...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4 fade-up">
              <OverallScoreBadge score={result.overallScore} />
              <div className="card p-6 space-y-5">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C4B5FD' }}>Dimension Scores</p>
                {result.scores.map(s => (
                  <ScoreBar key={s.dimension} label={s.dimension} score={s.score} rationale={s.rationale} suggestion={s.suggestion} />
                ))}
              </div>
              {result.strengths?.length > 0 && (
                <div className="card p-5" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#86EFAC' }}>Strengths</p>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                        <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.topFixes?.length > 0 && (
                <div className="card p-5" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FCD34D' }}>Priority Fixes</p>
                  <ul className="space-y-2">
                    {result.topFixes.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                        <span className="text-amber-400 flex-shrink-0 font-bold">{i + 1}.</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.improvedPrompt && (
                <div className="card p-5" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C4B5FD' }}>Improved Prompt</p>
                    <CopyButton text={result.improvedPrompt} />
                  </div>
                  <pre className="code-block text-xs">{result.improvedPrompt}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
