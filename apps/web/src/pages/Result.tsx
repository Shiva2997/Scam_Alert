import { Link, Navigate, useLocation } from 'react-router-dom'
import { questions } from '../data'
import { assess, LEVEL_INFO } from '../lib/scoring'
import type { Answer, Phase, RiskLevel } from '../types'
import PhaseBadge from '../components/PhaseBadge'

const LEVEL_STYLE: Record<RiskLevel, string> = {
  strong: 'bg-strong-soft text-strong border-strong/40',
  some: 'bg-some-soft text-some border-some/40',
  few: 'bg-few-soft text-few border-few/40',
}

const PHASES: Phase[] = ['pause', 'prove', 'protect']

export default function Result() {
  const location = useLocation()
  const answers = (location.state as { answers?: Record<string, Answer> } | null)?.answers
  if (!answers) return <Navigate to="/assess" replace />

  const result = assess(questions, answers)
  const info = LEVEL_INFO[result.level]

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <section className={`rounded-2xl border-2 p-5 ${LEVEL_STYLE[result.level]}`} aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Your result</p>
        <h1 className="mt-1 text-3xl font-bold">{info.headline}</h1>
        <p className="mt-2 text-ink">{info.summary}</p>
      </section>

      {result.flagged.length > 0 && (
        <section aria-labelledby="signs">
          <h2 id="signs" className="text-xl font-bold">
            Warning signs you noticed
          </h2>
          <ul className="mt-3 space-y-3">
            {result.flagged.map((q) => (
              <li key={q.id} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-semibold">{q.flag}</p>
                <p className="mt-1 text-muted">{q.why}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.unsure.length > 0 && (
        <section aria-labelledby="unsure">
          <h2 id="unsure" className="text-xl font-bold">
            Worth checking
          </h2>
          <p className="mt-1 text-muted">
            You weren't sure about these. Treat them as possible warning signs until you've verified.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            {result.unsure.map((q) => (
              <li key={q.id}>{q.flag}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="next">
        <h2 id="next" className="text-xl font-bold">
          What to do next
        </h2>
        <div className="mt-3 space-y-4">
          {PHASES.map((phase) => (
            <div key={phase} className="rounded-xl border border-line bg-surface p-4">
              <PhaseBadge phase={phase} />
              <ul className="mt-3 list-disc space-y-2 pl-6">
                {result.steps[phase].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className="rounded-xl bg-surface-2 p-4 text-sm text-muted">
        <strong className="text-ink">This is decision support, not a guarantee.</strong> Scam Aware
        looks for common warning signs in your answers. It cannot check the message itself or vouch for
        any person or request. When in doubt, verify through a channel you trust.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/help"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-brand px-5 font-semibold text-brand-ink"
        >
          Report it or get help
        </Link>
        <Link
          to="/assess"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border-2 border-line bg-surface px-5 font-semibold"
        >
          Check another request
        </Link>
      </div>
    </div>
  )
}
