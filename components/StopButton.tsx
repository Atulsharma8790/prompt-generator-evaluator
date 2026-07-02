'use client'
import { useLab } from '@/lib/LabContext'

export function StopButton({ task }: { task: 'generator' | 'evaluator' | 'rag' }) {
  const { activeTask, stopActiveTask } = useLab()
  if (activeTask !== task) return null
  return (
    <button
      onClick={stopActiveTask}
      className="btn w-full text-sm font-semibold"
      style={{
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#FCA5A5',
      }}
    >
      ✕ Stop
    </button>
  )
}
