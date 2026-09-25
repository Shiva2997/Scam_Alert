import { describe, expect, it } from 'vitest'
import { alerts } from '../src/data'
import { isPublishable, publishableAlerts, publisherCount } from '../src/lib/alerts'
import type { Alert } from '../src/types'

const base = alerts[0]
const withSources = (sources: Alert['sources'], extra: Partial<Alert> = {}): Alert => ({ ...base, ...extra, sources })

describe('seed alerts', () => {
  it('has 3–5 alerts, all publishable', () => {
    expect(alerts.length).toBeGreaterThanOrEqual(3)
    expect(alerts.length).toBeLessThanOrEqual(5)
    expect(publishableAlerts(alerts)).toHaveLength(alerts.length)
  })

  it('every alert cites at least two independent publishers over https', () => {
    for (const a of alerts) {
      expect(publisherCount(a), a.id).toBeGreaterThanOrEqual(2)
      for (const s of a.sources) expect(s.url).toMatch(/^https:\/\//)
    }
  })

  it('every alert has warning signs and verification steps', () => {
    for (const a of alerts) {
      expect(a.warning_signs.length).toBeGreaterThan(0)
      expect(a.verification_steps.length).toBeGreaterThan(0)
      expect(a.last_reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})

describe('two-source rule', () => {
  const ftc = { name: 'FTC', title: 'a', url: 'https://consumer.ftc.gov/a', published: null }
  const ftc2 = { name: 'FTC', title: 'b', url: 'https://consumer.ftc.gov/b', published: null }
  const fbi = { name: 'FBI IC3', title: 'c', url: 'https://www.ic3.gov/c', published: null }

  it('rejects a single source', () => {
    expect(isPublishable(withSources([ftc]))).toBe(false)
  })

  it('rejects two pages from the same publisher', () => {
    expect(isPublishable(withSources([ftc, ftc2]))).toBe(false)
  })

  it('accepts two different publishers', () => {
    expect(isPublishable(withSources([ftc, fbi]))).toBe(true)
  })

  it('rejects drafts, retired and non-corroborated alerts', () => {
    expect(isPublishable(withSources([ftc, fbi], { status: 'draft' }))).toBe(false)
    expect(isPublishable(withSources([ftc, fbi], { status: 'retired' }))).toBe(false)
    expect(isPublishable(withSources([ftc, fbi], { confidence: 'emerging' }))).toBe(false)
  })
})
