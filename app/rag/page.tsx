'use client'
import { ScoreBar, OverallScoreBadge } from '@/components/ScoreBar'
import { triggerPasscodeCheck } from '@/components/PasscodeModal'
import { useLab } from '@/lib/LabContext'
import { StopButton } from '@/components/StopButton'

const EXAMPLE = {
  question: 'What is the refund policy for annual subscriptions?',
  context: `Acme SaaS Refund Policy (Updated Jan 2025):

Monthly subscriptions: Customers may request a full refund within 7 days of the billing date. After 7 days, no refund is issued for the current billing period but the subscription will not renew.

Annual subscriptions: Customers may request a pro-rated refund within 30 days of the subscription start date. The refund amount is calculated as: (remaining months / 12) × annual price. After 30 days, no refunds are issued for annual plans.

Enterprise plans: Governed by individual contract terms. Contact enterprise@acme.com.

To request a refund, customers should email billing@acme.com with their account email and order ID.`,
  answer: 'Annual subscriptions can be refunded within the first 14 days for a full refund. After that, no refunds are available. You need to contact support@acme.com to initiate the process.',
}

export default function RagPage() {
  const { rag, setRag, activeTask, setActiveTask, abortRef } = useLab()
  const { question, context, answer, result, loading, error } = rag

  const loadExample = () => setRag({ question: EXAMPLE.question, context: EXAMPLE.context, answer: EXAMPLE.answer, result: null })

  const evaluate = async () => {
    if (!question.trim() || !context.trim() || !answer.trim()) return
    if (activeTask && activeTask !== 'rag') return
    const ok = await triggerPasscodeCheck()
    if (!ok) return
    setRag({ loading: true, error: '', result: null })
    setActiveTask('rag')
    const ctrl = new AbortController()
    abortRef.current = ctrl
    try {
      const res = await fetch('/api/rag-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context, answer }),
        signal: ctrl.signal,
      })
      const data = await res.json()
      if (!res.ok) { setRag({ error: data.error }); return }
      setRag({ result: data })
    } catch (e) {
      if ((e as Error).name !== 'AbortError')
        setRag({ error: 'Network error — is the server running?' })
    } finally {
      setRag({ loading: false })
      setActiveTask(null)
      abortRef.current = null
    }
  }

  const filled = question.trim() && context.trim() && answer.trim()
  const otherRunning = activeTask && activeTask !== 'rag'

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>📊</div>
          <h1 className="text-2xl font-black text-white">RAG Evaluator</h1>
        </div>
        <p className="text-[#7B8FA8] text-sm ml-[52px]">Evaluate your RAG pipeline across 4 RAGAS-style metrics including hallucination detection.</p>
      </div>

      {otherRunning && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm text-amber-300 flex items-center gap-2"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          ⚠ Another tool is currently running. Please wait for it to finish.
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_1.05fr] gap-6">
        {/* ── Left: Inputs ── */}
        <div className="space-y-4">
          <div className="card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#67E8F9' }}>3 Inputs Required</p>
              <button onClick={loadExample}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#67E8F9' }}>
                Load example (with hallucination)
              </button>
            </div>

            <div>
              <label className="label">1 · Question / Query</label>
              <textarea className="input" rows={2}
                placeholder="The user's original question..."
                value={question} onChange={e => setRag({ question: e.target.value })} />
            </div>
            <div>
              <label className="label">2 · Retrieved Context</label>
              <textarea className="input" rows={8}
                placeholder="Paste the chunks retrieved from your vector store or document source..."
                value={context} onChange={e => setRag({ context: e.target.value })} />
            </div>
            <div>
              <label className="label">3 · LLM-Generated Answer</label>
              <textarea className="input" rows={4}
                placeholder="The answer your RAG pipeline generated..."
                value={answer} onChange={e => setRag({ answer: e.target.value })} />
            </div>

            <div className="flex gap-2">
              <button onClick={evaluate} disabled={loading || !filled || !!otherRunning}
                className={`btn btn-cyan ${loading ? 'flex-[3]' : 'w-full'}`}>
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent spin" /> Evaluating...</>
                  : '📊 Evaluate RAG Output'}
              </button>
              {loading && <StopButton task="rag" />}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              ⚠ {error}
            </div>
          )}

          <div className="card p-4 space-y-2" style={{ borderColor: 'rgba(6,182,212,0.15)' }}>
            <p className="text-xs font-semibold" style={{ color: '#67E8F9' }}>What each metric means</p>
            {[
              ['Faithfulness',       'Is every claim in the answer supported by context?'],
              ['Answer Relevance',   'Does the answer address the actual question?'],
              ['Context Recall',     'Does the context contain what is needed to answer?'],
              ['Context Precision',  'How focused / noise-free is the retrieved context?'],
            ].map(([m, d]) => (
              <div key={m} className="flex gap-2">
                <span className="text-xs font-semibold w-32 flex-shrink-0" style={{ color: '#22D3EE' }}>{m}</span>
                <span className="text-xs text-[#64748B]">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div>
          {!result && !loading && (
            <div className="card p-12 flex flex-col items-center justify-center text-center" style={{ minHeight: '350px' }}>
              <div className="text-4xl mb-3">📊</div>
              <p className="text-[#475569] text-sm">RAG evaluation results will appear here.</p>
              <p className="text-[#334155] text-xs mt-1">Try &ldquo;Load example (with hallucination)&rdquo; to see the evaluator catch errors.</p>
            </div>
          )}
          {loading && (
            <div className="card p-12 flex flex-col items-center justify-center" style={{ minHeight: '350px' }}>
              <div className="w-10 h-10 rounded-full border-2 border-[#06B6D4] border-t-transparent spin mb-4" />
              <p className="text-[#6B7F96] text-sm">Evaluating your RAG output...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4 fade-up">
              <div className="space-y-3">
                <OverallScoreBadge score={result.overallScore} />
                {result.hallucinationFlag ? (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <span className="text-red-400 text-lg flex-shrink-0">⚠</span>
                    <div>
                      <p className="text-red-300 text-xs font-bold uppercase tracking-wider mb-1">Hallucination Detected</p>
                      <p className="text-red-200/70 text-xs leading-relaxed">{result.hallucinationDetails}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <span className="text-emerald-400">✓</span>
                    <p className="text-emerald-300 text-xs font-semibold">No hallucinations detected — answer is grounded in context.</p>
                  </div>
                )}
              </div>
              <div className="card p-6 space-y-5">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#67E8F9' }}>Metric Scores</p>
                {result.scores.map(s => (
                  <ScoreBar key={s.metric} label={s.metric} score={s.score} rationale={s.rationale} detail={s.detail} />
                ))}
              </div>
              {result.suggestions?.length > 0 && (
                <div className="card p-5" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#67E8F9' }}>How to Improve</p>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                        <span className="text-cyan-400 flex-shrink-0 font-bold">{i + 1}.</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
