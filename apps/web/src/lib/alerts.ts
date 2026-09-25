import type { Alert } from '../types'

/**
 * Two-source rule: an alert is only shown publicly if it is approved,
 * marked corroborated, and cites at least two sources from different
 * publishers. In Phase 5 "different publisher" becomes a proper
 * independence check using ownership groups from the source registry.
 */
export function publisherCount(alert: Alert): number {
  const hosts = new Set(
    alert.sources.map((s) => {
      try {
        return new URL(s.url).hostname.replace(/^www\./, '')
      } catch {
        return s.url
      }
    }),
  )
  const names = new Set(alert.sources.map((s) => s.name.trim().toLowerCase()))
  return Math.min(hosts.size, names.size)
}

export function isPublishable(alert: Alert): boolean {
  return (
    alert.status === 'approved' &&
    alert.confidence === 'corroborated' &&
    publisherCount(alert) >= 2
  )
}

export function publishableAlerts(alerts: Alert[]): Alert[] {
  return alerts
    .filter(isPublishable)
    .sort((a, b) => b.last_reviewed.localeCompare(a.last_reviewed))
}

const LABELS: Record<string, string> = {
  US: 'United States',
  IN: 'India',
  global: 'Worldwide',
  sms: 'Text message',
  phone: 'Phone call',
  voice_clone: 'Cloned voice',
  video_call: 'Video call',
  email: 'Email',
  pop_up: 'Pop-up',
  messaging_app: 'Messaging app',
}

export function label(code: string): string {
  return LABELS[code] ?? code.replace(/_/g, ' ')
}
