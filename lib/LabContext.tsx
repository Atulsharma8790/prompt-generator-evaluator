'use client'
import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import type { GenerateRequest, GeneratedPrompt, PromptEvalResult, RagEvalResult, ModelId } from './types'

// ── Generator state ───────────────────────────────────────────
export interface GenState {
  form: GenerateRequest
  result: GeneratedPrompt | null
  loading: boolean
  error: string
}

const defaultGenForm: GenerateRequest = {
  useCase: '', model: 'claude-sonnet-4-6', tone: 'professional',
  taskType: 'generation', fewShot: false, chainOfThought: false,
}

// ── Evaluator state ───────────────────────────────────────────
export interface EvalState {
  prompt: string
  result: PromptEvalResult | null
  loading: boolean
  error: string
}

// ── RAG state ─────────────────────────────────────────────────
export interface RagState {
  question: string
  context: string
  answer: string
  model: ModelId
  result: RagEvalResult | null
  loading: boolean
  error: string
}

// ── Active-task ───────────────────────────────────────────────
export type ActiveTask = 'generator' | 'evaluator' | 'rag' | null

// Maps task name → its URL path
const TASK_PATH: Record<string, string> = {
  generator: '/generator',
  evaluator: '/evaluator',
  rag:       '/rag',
}

interface LabCtx {
  gen:    GenState;  setGen:    (s: Partial<GenState>)  => void
  eval_:  EvalState; setEval_:  (s: Partial<EvalState>) => void
  rag:    RagState;  setRag:    (s: Partial<RagState>)  => void
  activeTask: ActiveTask
  setActiveTask: (t: ActiveTask) => void
  stopActiveTask: () => void          // cancel & clear loading state
  abortRef: React.MutableRefObject<AbortController | null>
  providers: { anthropic: boolean; openai: boolean }
  // Tab-switch guard — only blocks leaving the page that OWNS the running task
  requestNavAway: (onConfirmed: () => void, currentPath: string, targetHref: string) => void
  navWarningVisible: boolean
  confirmNavAway: () => void
  cancelNavAway:  () => void
}

const Ctx = createContext<LabCtx | null>(null)

export function LabProvider({ children }: { children: ReactNode }) {
  const [gen,   setGenFull]  = useState<GenState>({ form: defaultGenForm, result: null, loading: false, error: '' })
  const [eval_, setEvalFull] = useState<EvalState>({ prompt: '', result: null, loading: false, error: '' })
  const [rag,   setRagFull]  = useState<RagState>({ question: '', context: '', answer: '', model: 'claude-sonnet-4-6', result: null, loading: false, error: '' })
  const [activeTask, setActiveTask] = useState<ActiveTask>(null)
  const [providers, setProviders]   = useState({ anthropic: true, openai: false })

  // Shared AbortController — replaced each time a new task starts
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    fetch('/api/providers').then(r => r.json()).then(setProviders).catch(() => {})
  }, [])

  const setGen   = useCallback((s: Partial<GenState>)  => setGenFull(p  => ({ ...p,  ...s })), [])
  const setEval_ = useCallback((s: Partial<EvalState>) => setEvalFull(p => ({ ...p,  ...s })), [])
  const setRag   = useCallback((s: Partial<RagState>)  => setRagFull(p  => ({ ...p,  ...s })), [])

  // Hard-stop: abort the in-flight request and clear loading state for the active tool
  const stopActiveTask = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (activeTask === 'generator') setGen({ loading: false, error: '' })
    if (activeTask === 'evaluator') setEval_({ loading: false, error: '' })
    if (activeTask === 'rag')       setRag({ loading: false, error: '' })
    setActiveTask(null)
  }, [activeTask, setGen, setEval_, setRag])

  // ── Nav guard ──────────────────────────────────────────────────
  const [navWarningVisible, setNavWarningVisible] = useState(false)
  const pendingNavCallback = useRef<(() => void) | null>(null)

  const requestNavAway = useCallback((
    onConfirmed: () => void,
    currentPath: string,
    targetHref:  string,
  ) => {
    // Only intercept if the task running belongs to the CURRENT page
    const currentPageTask = Object.entries(TASK_PATH).find(([, p]) => currentPath.startsWith(p))?.[0] as ActiveTask | undefined
    const isCurrentPageRunning = activeTask && activeTask === currentPageTask
    // Never block if heading back to the page that owns the running task
    const headingToOwner = activeTask && TASK_PATH[activeTask] === targetHref

    if (!isCurrentPageRunning || headingToOwner) { onConfirmed(); return }

    pendingNavCallback.current = onConfirmed
    setNavWarningVisible(true)
  }, [activeTask])

  const confirmNavAway = useCallback(() => {
    setNavWarningVisible(false)
    pendingNavCallback.current?.()
    pendingNavCallback.current = null
  }, [])

  const cancelNavAway = useCallback(() => {
    setNavWarningVisible(false)
    pendingNavCallback.current = null
  }, [])

  return (
    <Ctx.Provider value={{
      gen, setGen, eval_, setEval_, rag, setRag,
      activeTask, setActiveTask, stopActiveTask, abortRef,
      providers,
      requestNavAway, navWarningVisible, confirmNavAway, cancelNavAway,
    }}>
      {children}

      {/* Tab-switch warning */}
      {navWarningVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl p-6"
            style={{ width: 380, background: '#0F1117', border: '1px solid rgba(245,158,11,0.35)', boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}>
            <div className="flex items-start gap-3 mb-4">
              <span className="text-lg flex-shrink-0 mt-0.5">⚠</span>
              <div>
                <h3 className="text-white font-bold text-base mb-1">Leave this tool?</h3>
                <p className="text-[#7B8FA8] text-xs leading-relaxed">
                  A task is in progress. Switching now may discard unsaved results.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed mb-5 pl-7">
              <span className="text-[#FCD34D] font-semibold">Tip:</span> Wait for results, then switch — data persists across tabs.
            </p>
            <div className="flex gap-2">
              <button onClick={cancelNavAway}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8' }}>
                Stay here
              </button>
              <button onClick={confirmNavAway}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
                Leave anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

export function useLab() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLab must be used inside LabProvider')
  return ctx
}
