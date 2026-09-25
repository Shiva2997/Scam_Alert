import type { Phase } from '../types'
import { PHASE_META } from '../lib/phases'

export default function PhaseBadge({ phase }: { phase: Phase }) {
  const { label, Icon, text, bg } = PHASE_META[phase]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${bg} ${text}`}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  )
}
