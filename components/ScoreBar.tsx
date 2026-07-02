'use client'

interface ScoreBarProps {
  label: string
  score: number
  rationale: string
  suggestion?: string
  detail?: string
}

const color = (s: number) =>
  s >= 8 ? '#22C55E' : s >= 6 ? '#F59E0B' : '#EF4444'

export function ScoreBar({ label, score, rationale, suggestion, detail }: ScoreBarProps) {
  const c = color(score)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color: c }}>{score.toFixed(1)}<span className="text-[#475569] font-normal">/10</span></span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score * 10}%`, background: c, boxShadow: `0 0 8px ${c}60` }}
        />
      </div>
      <p className="text-xs text-[#94A3B8] leading-relaxed">{rationale}</p>
      {detail && <p className="text-xs text-[#64748B] leading-relaxed italic">{detail}</p>}
      {suggestion && score < 8 && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg mt-1"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <span className="text-amber-400 text-xs flex-shrink-0 mt-0.5">→</span>
          <p className="text-xs text-amber-200/80">{suggestion}</p>
        </div>
      )}
    </div>
  )
}

export function OverallScoreBadge({ score }: { score: number }) {
  const c = color(score)
  const label = score >= 8 ? 'Excellent' : score >= 6 ? 'Needs Work' : 'Poor'
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl"
      style={{ background: `${c}10`, border: `1px solid ${c}30` }}>
      <div className="text-5xl font-black tabular-nums" style={{ color: c }}>{score.toFixed(1)}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: c }}>{label}</p>
        <p className="text-[#94A3B8] text-xs">Overall score out of 10</p>
      </div>
    </div>
  )
}
