import { Link } from 'react-router-dom'
import { alerts } from '../data'
import { publishableAlerts } from '../lib/alerts'
import { PHASE_META } from '../lib/phases'
import type { Phase } from '../types'

const PHASES: { phase: Phase; body: string }[] = [
  { phase: 'pause', body: "Stop before you reply, click, pay or share. Pressure is a warning sign." },
  { phase: 'prove', body: 'Check the request through a channel you already trust — not the one in the message.' },
  { phase: 'protect', body: 'Guard your money, passwords and codes. Report it and get help if needed.' },
]

export default function Home() {
  const latest = publishableAlerts(alerts).slice(0, 2)

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-brand px-5 py-8 text-brand-ink sm:px-8 sm:py-10">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          Got a suspicious call, text or email?
        </h1>
        <p className="mt-3 max-w-xl text-lg opacity-90">
          Answer a few quick questions to spot the warning signs and find out how to check it
          before you act. Takes about two minutes.
        </p>
        <Link
          to="/assess"
          className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-brand-ink px-6 text-lg font-semibold text-brand shadow-sm hover:opacity-90"
        >
          Check a request
        </Link>
        <p className="mt-4 text-sm opacity-80">No sign-up. Nothing you enter leaves your device.</p>
      </section>

      <section aria-labelledby="ppp">
        <h2 id="ppp" className="text-xl font-bold">
          Pause. Prove. Protect.™
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {PHASES.map(({ phase, body }, i) => {
            const { label, Icon, text, bg } = PHASE_META[phase]
            return (
              <li key={phase} className="rounded-2xl border border-line bg-surface p-5">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${bg} ${text}`}>
                  <Icon />
                </div>
                <h3 className="mt-3 font-bold">
                  <span className="sr-only">Step {i + 1}: </span>
                  {label}
                </h3>
                <p className="mt-1 text-muted">{body}</p>
              </li>
            )
          })}
        </ol>
        <Link to="/checklist" className="mt-4 inline-block font-semibold text-brand underline underline-offset-4">
          See the full checklist
        </Link>
      </section>

      {latest.length > 0 && (
        <section aria-labelledby="latest">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="latest" className="text-xl font-bold">
              Scams to watch for
            </h2>
            <Link to="/alerts" className="text-sm font-semibold text-brand underline underline-offset-4">
              All alerts
            </Link>
          </div>
          <ul className="mt-4 grid gap-3">
            {latest.map((a) => (
              <li key={a.id} className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="font-bold">{a.title}</h3>
                <p className="mt-1 text-muted">{a.summary}</p>
                <Link
                  to={`/alerts?open=${a.id}`}
                  className="mt-2 inline-block text-sm font-semibold text-brand underline underline-offset-4"
                >
                  Warning signs and what to do
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-strong/30 bg-strong-soft p-5">
        <h2 className="font-bold text-strong">Already paid or shared your details?</h2>
        <p className="mt-1">
          Act quickly: call your bank using the number on your card, then report it.
        </p>
        <Link to="/help" className="mt-2 inline-block font-semibold text-strong underline underline-offset-4">
          Where to report and get help
        </Link>
      </section>
    </div>
  )
}
