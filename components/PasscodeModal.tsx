'use client'
import { useState, useEffect, useCallback } from 'react'

const SESSION_KEY = 'pl_auth'

type Resolve = (ok: boolean) => void
let pendingResolve: Resolve | null = null
const SHOW_EVENT = 'pl:show-passcode'

export function triggerPasscodeCheck(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (sessionStorage.getItem(SESSION_KEY) === '1') return Promise.resolve(true)
  return new Promise<boolean>(resolve => {
    pendingResolve = resolve
    window.dispatchEvent(new Event(SHOW_EVENT))
  })
}

export function PasscodeModal() {
  const [open, setOpen]         = useState(false)
  const [passcode, setPasscode] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [show, setShow]         = useState(false)

  const dismiss = useCallback((ok: boolean) => {
    setOpen(false)
    setPasscode('')
    setError('')
    setShow(false)
    // Resolve on next tick so the modal finishes closing before the
    // caller's setLoading(true) fires — prevents the spinner mounting
    // inside the modal before it unmounts (which caused the stuck loader).
    const resolve = pendingResolve
    pendingResolve = null
    setTimeout(() => resolve?.(ok), 0)
  }, [])

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener(SHOW_EVENT, handler)
    return () => window.removeEventListener(SHOW_EVENT, handler)
  }, [])

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcode.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      })
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, '1')
        dismiss(true)
      } else {
        setError('Wrong passcode — try again.')
        setPasscode('')
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: '#0F1117',
          border: '1px solid rgba(99,102,241,0.35)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg,#6366F1,#A855F7)',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            }}
          >
            🔒
          </div>
          <h2 className="text-white font-black text-xl mb-1">Action Locked</h2>
          <p className="text-[#7B8FA8] text-sm">
            Enter the passcode to run this tool.
            <br />
            <span className="text-[#475569] text-xs">You only need to do this once per session.</span>
          </p>
        </div>

        <form onSubmit={unlock} className="space-y-4">
          {/* Input with non-overlapping Show/Hide */}
          <div className="flex gap-2">
            <input
              type={show ? 'text' : 'password'}
              placeholder="Enter passcode"
              value={passcode}
              onChange={e => { setPasscode(e.target.value); setError('') }}
              autoFocus
              className="input flex-1"
              style={{ letterSpacing: show ? 'normal' : '0.18em' }}
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              className="flex-shrink-0 px-3 rounded-xl text-xs font-semibold transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#64748B',
              }}
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 font-medium flex items-center gap-1.5">
              <span>⚠</span> {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => dismiss(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#475569] transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !passcode.trim()}
              className="flex-1 btn btn-indigo disabled:opacity-50"
            >
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent spin inline-block" /> Verifying...</>
                : 'Unlock →'}
            </button>
          </div>
        </form>

        <p className="text-center text-[#1E293B] text-xs mt-5">
          Contact{' '}
          <a
            href="https://atulsharma8790.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#334155] hover:text-[#6366F1] transition-colors"
          >
            Atul Sharma
          </a>{' '}
          if you need access.
        </p>
      </div>
    </div>
  )
}
