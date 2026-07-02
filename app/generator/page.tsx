'use client'
import { CopyButton } from '@/components/CopyButton'
import { MODEL_OPTIONS } from '@/lib/types'
import type { GenerateRequest } from '@/lib/types'
import { triggerPasscodeCheck } from '@/components/PasscodeModal'
import { useLab } from '@/lib/LabContext'
import { StopButton } from '@/components/StopButton'

const TONES = ['professional', 'conversational', 'technical', 'concise', 'educational']
const TASK_TYPES = ['classification', 'summarization', 'extraction', 'generation', 'qa', 'reasoning', 'code', 'rag', 'agent', 'evaluation']

const EXAMPLES = [
  {
    label: 'Customer Support Bot',
    useCase: 'A customer support bot for a SaaS product that handles refund requests, billing questions, and account lockouts. It should be empathetic, collect necessary details (order ID, account email), resolve simple cases directly, and escalate complex ones to a human agent.',
    taskType: 'qa' as const, tone: 'conversational' as const,
  },
  {
    label: 'Code Reviewer',
    useCase: 'An AI code reviewer that reviews pull requests for Python/TypeScript code. It should check for bugs, security vulnerabilities (OWASP top 10), performance issues, and style violations. Output structured feedback with severity levels: critical, warning, suggestion.',
    taskType: 'code' as const, tone: 'technical' as const,
  },
  {
    label: 'Document Summariser',
    useCase: 'Summarise long legal contracts or policy documents into plain English. Extract: key obligations, important dates, penalties, termination clauses, and any unusual or risky terms the reader should pay attention to.',
    taskType: 'summarization' as const, tone: 'professional' as const,
  },
  {
    label: 'RAG Answer Generator',
    useCase: 'Generate accurate answers from retrieved document chunks. Must cite the source chunk, stay strictly grounded in the provided context, and clearly state when the context does not contain enough information to answer.',
    taskType: 'rag' as const, tone: 'professional' as const,
  },
]

export default function GeneratorPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { gen, setGen, activeTask, setActiveTask, stopActiveTask, abortRef, providers } = useLab()
  const { form, result, loading, error } = gen

  const setForm = (patch: Partial<GenerateRequest>) =>
    setGen({ form: { ...form, ...patch } })

  const generate = async () => {
    if (!form.useCase.trim()) return
    if (activeTask && activeTask !== 'generator') return  // another tool running
    const ok = await triggerPasscodeCheck()
    if (!ok) return
    setGen({ loading: true, error: '', result: null })
    setActiveTask('generator')
    const ctrl = new AbortController()
    abortRef.current = ctrl
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: ctrl.signal,
      })
      const data = await res.json()
      if (!res.ok) { setGen({ error: data.error }); return }
      setGen({ result: data })
    } catch (e) {
      if ((e as Error).name !== 'AbortError')
        setGen({ error: 'Network error — is the server running?' })
    } finally {
      setGen({ loading: false })
      setActiveTask(null)
      abortRef.current = null
    }
  }

  const selectedProvider = MODEL_OPTIONS.find(m => m.value === form.model)?.provider
  const openaiMissing = selectedProvider === 'openai' && !providers.openai
  const otherRunning = activeTask && activeTask !== 'generator'

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>⚡</div>
          <h1 className="text-2xl font-black text-white">Prompt Generator</h1>
        </div>
        <p className="text-[#7B8FA8] text-sm ml-[52px]">Describe your use-case → get a production-grade prompt instantly.</p>
      </div>

      {otherRunning && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm text-amber-300 flex items-center gap-2"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          ⚠ Another tool is currently running. Please wait for it to finish before generating.
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        {/* ── Left: Form ── */}
        <div className="space-y-4">
          <div className="card p-6 space-y-5">
            {/* Quick-load examples */}
            <div>
              <p className="label mb-2">Load an Example</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map(ex => (
                  <button key={ex.label} onClick={() => setGen({ form: { ...form, useCase: ex.useCase, taskType: ex.taskType, tone: ex.tone }, result: null })}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Use-Case Description *</label>
              <textarea className="input" rows={5}
                placeholder="e.g. A customer support bot that handles refund requests..."
                value={form.useCase}
                onChange={e => setForm({ useCase: e.target.value })} />
            </div>

            {/* Model picker */}
            <div>
              <label className="label">Model</label>
              <div className="space-y-2">
                <p className="text-[#475569] text-xs font-semibold">Claude (Anthropic)</p>
                <div className="flex flex-wrap gap-2">
                  {MODEL_OPTIONS.filter(m => m.provider === 'anthropic').map(m => (
                    <button key={m.value} onClick={() => setForm({ model: m.value })}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: form.model === m.value ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.model === m.value ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        color: form.model === m.value ? '#818CF8' : '#6B7F96',
                      }}>{m.label}</button>
                  ))}
                </div>
                <p className="text-[#475569] text-xs font-semibold mt-2">GPT (OpenAI)</p>
                <div className="flex flex-wrap gap-2">
                  {MODEL_OPTIONS.filter(m => m.provider === 'openai').map(m => (
                    <button key={m.value} onClick={() => setForm({ model: m.value })}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: form.model === m.value ? 'rgba(16,163,127,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.model === m.value ? 'rgba(16,163,127,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        color: form.model === m.value ? '#34D399' : '#6B7F96',
                      }}>{m.label}</button>
                  ))}
                </div>
                {openaiMissing && (
                  <p className="text-[#F59E0B] text-xs mt-1">⚠ OPENAI_API_KEY not found in .env.local — GPT models won&apos;t work.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Tone</label>
                <select className="input" value={form.tone} onChange={e => setForm({ tone: e.target.value as GenerateRequest['tone'] })}>
                  {TONES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Task Type</label>
                <select className="input" value={form.taskType} onChange={e => setForm({ taskType: e.target.value as GenerateRequest['taskType'] })}>
                  {TASK_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {[
                { key: 'fewShot' as const, label: '📎 Few-shot examples' },
                { key: 'chainOfThought' as const, label: '🧠 Chain-of-thought' },
              ].map(({ key, label }) => {
                const on = form[key] as boolean
                return (
                  <button key={key} onClick={() => setForm({ [key]: !on })}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: on ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${on ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: on ? '#818CF8' : '#6B7F96',
                    }}>
                    <span className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                      style={{ borderColor: on ? '#6366F1' : '#334155', background: on ? '#6366F1' : 'transparent' }}>
                      {on && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    {label}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-2">
              <button onClick={generate} disabled={loading || !form.useCase.trim() || !!otherRunning || openaiMissing}
                className={`btn btn-indigo ${loading ? 'flex-[3]' : 'w-full'}`}>
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent spin" /> Generating...</>
                  : '⚡ Generate Prompt'}
              </button>
              {loading && <StopButton task="generator" />}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* ── Right: Result ── */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="card p-12 flex flex-col items-center justify-center text-center" style={{ minHeight: '300px' }}>
              <div className="text-4xl mb-3">⚡</div>
              <p className="text-[#475569] text-sm">Your generated prompt will appear here.</p>
              <p className="text-[#334155] text-xs mt-1">Try a quick example or describe your own use-case.</p>
            </div>
          )}
          {loading && (
            <div className="card p-12 flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
              <div className="w-10 h-10 rounded-full border-2 border-[#6366F1] border-t-transparent spin mb-4" />
              <p className="text-[#6B7F96] text-sm">Generating your prompt...</p>
            </div>
          )}
          {result && (
            <div className="space-y-4 fade-up">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#818CF8' }}>System Prompt</span>
                  <CopyButton text={result.systemPrompt} />
                </div>
                <pre className="code-block text-xs">{result.systemPrompt}</pre>
              </div>
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#818CF8' }}>User Turn Template</span>
                  <CopyButton text={result.userTemplate} />
                </div>
                <pre className="code-block text-xs">{result.userTemplate}</pre>
              </div>
              {result.fewShotExamples && (
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#818CF8' }}>Few-shot Examples</span>
                    <CopyButton text={result.fewShotExamples} />
                  </div>
                  <pre className="code-block text-xs">{result.fewShotExamples}</pre>
                </div>
              )}
              <div className="card p-5" style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#818CF8' }}>Design Decisions</p>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{result.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
