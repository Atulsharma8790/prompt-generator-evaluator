'use client'
import { useState, useEffect } from 'react'

const SESSION_KEY = 'pl_auth'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed]     = useState(false)
  const [passcode, setPasscode] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [show, setShow]         = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true)
    setChecking(false)
  }, [])

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcode.trim()) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      })
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, '1')
        setAuthed(true)
      } else {
        setError('Wrong passcode — try again.')
        setPasscode('')
      }
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  if (checking) return null

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,#6366F1,#A855F7)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
              ⚡
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Prompt Lab</h1>
            <p className="text-[#7B8FA8] text-sm">Enter passcode to continue</p>
          </div>

          <form onSubmit={unlock} className="card p-6 space-y-4">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                placeholder="Passcode"
                value={passcode}
                onChange={e => { setPasscode(e.target.value); setError('') }}
                autoFocus
                className="input pr-12"
                style={{ fontSize: '1rem', letterSpacing: show ? 'normal' : '0.15em' }}
              />
              <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors text-xs font-medium">
                {show ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium">⚠ {error}</p>
            )}

            <button type="submit" disabled={loading || !passcode.trim()} className="btn btn-indigo w-full">
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent spin" /> Verifying...</>
                : 'Unlock →'}
            </button>
          </form>

          <p className="text-center text-[#334155] text-xs mt-6">
            Built by{' '}
            <a href="https://atulsharma8790.github.io" target="_blank" rel="noopener noreferrer"
              className="text-[#475569] hover:text-[#6366F1] transition-colors">
              Atul Sharma
            </a>
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
