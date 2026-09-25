import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
})

export const ShieldIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)
export const HomeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 11 12 4l9 7" />
    <path d="M5 10v10h14V10" />
  </svg>
)
export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
)
export const BellIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
)
export const ListIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m4 6 1.5 1.5L8 5" />
    <path d="m4 12 1.5 1.5L8 11" />
    <path d="m4 18 1.5 1.5L8 17" />
    <path d="M11 6h9M11 12h9M11 18h9" />
  </svg>
)
export const HelpIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12a8 8 0 1 1 16 0v5a2 2 0 0 1-2 2h-1v-6h3" />
    <path d="M4 13h3v6H6a2 2 0 0 1-2-2v-4" />
  </svg>
)
export const PauseIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 9v6M14 9v6" />
  </svg>
)
export const ProveIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 12l2 2 4-4" />
    <path d="M21 12a9 9 0 1 1-9-9" />
    <path d="M21 3v6h-6" />
  </svg>
)
export const ProtectIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
export const ExternalIcon = (p: P) => (
  <svg {...base({ width: 16, height: 16, ...p })}>
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)
export const ArrowLeftIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
)
