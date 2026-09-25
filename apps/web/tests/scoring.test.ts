import { describe, expect, it } from 'vitest'
import { questions } from '../src/data'
import { assess, BASE_STEPS, LEVEL_INFO } from '../src/lib/scoring'
import type { Answer } from '../src/types'

const all = (a: Answer) => Object.fromEntries(questions.map((q) => [q.id, a]))
const only = (ids: string[], rest: Answer = 'no') => ({ ...all(rest), ...Object.fromEntries(ids.map((id) => [id, 'yes' as Answer])) })

// Wording that would present the tool as an authority. The app must never say these.
const FORBIDDEN = /\b(is|looks|seems|appears|it's|its)\s+(safe|legitimate|genuine|real|fine|ok|okay)\b|\bno risk\b|\bnot a scam\b/i

describe('question bank', () => {
  it('has 8–12 questions with unique ids', () => {
    expect(questions.length).toBeGreaterThanOrEqual(8)
    expect(questions.length).toBeLessThanOrEqual(12)
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length)
  })

  it('every question explains why it matters and what to do', () => {
    for (const q of questions) {
      expect(q.weight).toBeGreaterThan(0)
      expect(q.why.length).toBeGreaterThan(20)
      expect(['pause', 'prove', 'protect']).toContain(q.action.phase)
    }
  })
})

describe('assess()', () => {
  it('all "no" gives the lowest level — "few warning signs", never "safe"', () => {
    const r = assess(questions, all('no'))
    expect(r.level).toBe('few')
    expect(r.flagged).toHaveLength(0)
    expect(LEVEL_INFO.few.headline).toMatch(/warning signs/i)
  })

  it('all "yes" gives strong warning signs', () => {
    expect(assess(questions, all('yes')).level).toBe('strong')
  })

  it.each(questions.filter((q) => q.critical).map((q) => q.id))(
    'a single critical signal (%s) is enough for "strong"',
    (id) => {
      expect(assess(questions, only([id])).level).toBe('strong')
    },
  )

  it('a single minor signal gives "few"', () => {
    expect(assess(questions, only(['unexpected'])).level).toBe('few')
  })

  it('two moderate signals give "some"', () => {
    expect(assess(questions, only(['urgency', 'authority'])).level).toBe('some')
  })

  it('enough non-critical signals add up to "strong"', () => {
    expect(assess(questions, only(['urgency', 'authority', 'device_access'])).level).toBe('strong')
  })

  it('"not sure" on a critical question is at least "some"', () => {
    const r = assess(questions, { ...all('no'), payment_method: 'unsure' })
    expect(r.level).toBe('some')
    expect(r.unsure.map((q) => q.id)).toEqual(['payment_method'])
  })

  it('unanswered questions are treated as "not sure", not as "no"', () => {
    const r = assess(questions, {})
    expect(r.unsure).toHaveLength(questions.length)
    expect(r.level).not.toBe('few')
  })

  it('always includes the base steps for every phase, without duplicates', () => {
    for (const answers of [all('no'), all('yes'), all('unsure')]) {
      const r = assess(questions, answers)
      for (const phase of ['pause', 'prove', 'protect'] as const) {
        for (const s of BASE_STEPS[phase]) expect(r.steps[phase]).toContain(s)
        expect(new Set(r.steps[phase]).size).toBe(r.steps[phase].length)
      }
    }
  })

  it('adds the specific action for each flagged signal', () => {
    const r = assess(questions, only(['credentials']))
    const q = questions.find((x) => x.id === 'credentials')!
    expect(r.steps[q.action.phase]).toContain(q.action.text)
  })
})

describe('responsible wording', () => {
  it('no result text ever tells the user a request is safe or genuine', () => {
    const texts = [
      ...Object.values(LEVEL_INFO).flatMap((l) => [l.headline, l.summary]),
      ...Object.values(BASE_STEPS).flat(),
      ...questions.flatMap((q) => [q.flag, q.why, q.action.text]),
    ]
    for (const t of texts) expect(t).not.toMatch(FORBIDDEN)
  })
})
