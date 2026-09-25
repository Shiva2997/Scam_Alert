export type Phase = 'pause' | 'prove' | 'protect'

export type Answer = 'yes' | 'no' | 'unsure'

export interface Question {
  id: string
  text: string
  hint?: string
  /** Contribution to the risk score when answered "yes" (half when "unsure"). */
  weight: number
  /** A "yes" to a critical question always produces the strongest result. */
  critical: boolean
  /** Manipulation technique, aligned with the alert taxonomy. */
  technique: string
  /** Short label shown on the result screen. */
  flag: string
  /** Why this signal matters, in plain language. */
  why: string
  /** Extra step added to the result when this signal is present. */
  action: { phase: Phase; text: string }
}

export type RiskLevel = 'few' | 'some' | 'strong'

export interface Assessment {
  level: RiskLevel
  score: number
  /** Questions answered "yes". */
  flagged: Question[]
  /** Questions answered "not sure" (or skipped). */
  unsure: Question[]
  steps: Record<Phase, string[]>
}

export interface AlertSource {
  name: string
  title: string
  url: string
  published: string | null
}

export interface Alert {
  id: string
  title: string
  status: 'draft' | 'approved' | 'retired'
  summary: string
  scam_type: string
  channels: string[]
  impersonated_entity: string | null
  manipulation_techniques: string[]
  requested_action: string
  payment_methods: string[]
  target_population: string[]
  geography: string[]
  warning_signs: string[]
  verification_steps: string[]
  sources: AlertSource[]
  confidence: 'corroborated' | 'emerging' | 'insufficient'
  last_reviewed: string
}

export interface ChecklistSection {
  phase: Phase
  title: string
  tagline: string
  items: string[]
}

export interface ResourceGroup {
  region: string
  label: string
  items: { name: string; description: string; url: string | null }[]
}
