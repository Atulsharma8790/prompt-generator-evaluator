'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useLab } from '@/lib/LabContext'

const TABS = [
  { href: '/generator', label: '⚡ Generator', color: '#6366F1' },
  { href: '/evaluator', label: '🔬 Evaluator', color: '#A855F7' },
  { href: '/rag',       label: '📊 RAG Eval',  color: '#06B6D4' },
  { href: '/guide',     label: '📖 Guide',      color: '#F59E0B' },
]

export function Nav() {
  const path    = usePathname()
  const router  = useRouter()
  const { activeTask, requestNavAway } = useLab()

  const navigate = (href: string) => {
    if (path === href) return
    requestNavAway(() => router.push(href), path, href)
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#07061A]/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg,#6366F1,#A855F7)' }}>⚡</div>
          <span className="font-bold text-sm text-white">Prompt Lab</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Active task indicator */}
          {activeTask && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#FCD34D' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] spin inline-block" />
              Running
            </div>
          )}

          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
            {TABS.map(t => {
              const active = path.startsWith(t.href)
              return (
                <button
                  key={t.href}
                  onClick={() => navigate(t.href)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: active ? t.color : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,0.38)',
                    boxShadow: active ? `0 2px 10px ${t.color}50` : 'none',
                  }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
