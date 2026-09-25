import type { Phase } from '../types'
import { PauseIcon, ProtectIcon, ProveIcon } from '../components/Icons'

export const PHASE_META: Record<Phase, { label: string; Icon: typeof PauseIcon; text: string; bg: string }> = {
  pause: { label: 'Pause', Icon: PauseIcon, text: 'text-pause', bg: 'bg-pause-soft' },
  prove: { label: 'Prove', Icon: ProveIcon, text: 'text-prove', bg: 'bg-prove-soft' },
  protect: { label: 'Protect', Icon: ProtectIcon, text: 'text-protect', bg: 'bg-protect-soft' },
}
