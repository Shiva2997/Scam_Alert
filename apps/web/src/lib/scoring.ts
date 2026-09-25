import type { Answer, Assessment, Phase, Question, RiskLevel } from '../types'

/**
 * Rule-based Pause.Prove.Protect. assessment.
 *
 * Design rules (see docs/responsible-ai.md):
 * - The result is a description of warning signs, never a verdict that a
 *   request is safe or genuine. The lowest level is "few warning signs found".
 * - "Not sure" and unanswered questions count as half a signal: uncertainty is
 *   a reason to verify, not a reason to relax.
 * - A "yes" to any critical question (irreversible payment, credential request,
 *   secrecy, bypassing normal process) always gives the strongest result.
 */

export const STRONG_THRESHOLD = 6
export const SOME_THRESHOLD = 2

export const BASE_STEPS: Record<Phase, string[]> = {
  pause: ["Stop. Don't reply, click, pay or share anything yet."],
  prove: [
    'Contact the person or organization using a phone number, website or app you already trust — not the details in the message.',
    'Talk it through with someone you trust before acting.',
  ],
  protect: [
    "Don't share passwords, one-time codes, PINs or card numbers.",
    'If you already paid or shared information, contact your bank right away and report it.',
  ],
}

export interface LevelInfo {
  headline: string
  summary: string
}

export const LEVEL_INFO: Record<RiskLevel, LevelInfo> = {
  strong: {
    headline: 'Strong warning signs',
    summary:
      'Your answers match tactics commonly used in scams. Do not pay, share information or click anything until you have verified the request yourself through a trusted channel.',
  },
  some: {
    headline: 'Some warning signs',
    summary:
      'Some of your answers match common scam tactics. Pause and verify through a channel you already trust before you act.',
  },
  few: {
    headline: 'Few warning signs found',
    summary:
      "Your answers didn't match the most common scam tactics. That is not a guarantee: scams change constantly, and no checklist can rule one out. Verify through a trusted channel before you pay or share anything.",
  },
}

export function assess(
  questions: Question[],
  answers: Partial<Record<string, Answer>>,
): Assessment {
  const flagged: Question[] = []
  const unsure: Question[] = []
  let score = 0
  let criticalYes = false
  let criticalUnsure = false

  for (const q of questions) {
    const a = answers[q.id] ?? 'unsure'
    if (a === 'yes') {
      flagged.push(q)
      score += q.weight
      if (q.critical) criticalYes = true
    } else if (a === 'unsure') {
      unsure.push(q)
      score += q.weight / 2
      if (q.critical) criticalUnsure = true
    }
  }

  let level: RiskLevel
  if (criticalYes || score >= STRONG_THRESHOLD) level = 'strong'
  else if (criticalUnsure || score >= SOME_THRESHOLD) level = 'some'
  else level = 'few'

  return { level, score, flagged, unsure, steps: buildSteps(flagged, unsure) }
}

function buildSteps(flagged: Question[], unsure: Question[]): Record<Phase, string[]> {
  const steps: Record<Phase, string[]> = {
    pause: [...BASE_STEPS.pause],
    prove: [],
    protect: [],
  }
  // Signal-specific steps first (most relevant), then the always-on basics.
  for (const q of [...flagged, ...unsure]) {
    const list = steps[q.action.phase]
    if (!list.includes(q.action.text)) list.push(q.action.text)
  }
  for (const phase of ['prove', 'protect'] as const) {
    for (const s of BASE_STEPS[phase]) if (!steps[phase].includes(s)) steps[phase].push(s)
  }
  return steps
}
