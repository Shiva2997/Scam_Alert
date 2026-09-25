import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { alerts } from '../data'
import { label, publishableAlerts } from '../lib/alerts'
import { ExternalIcon } from '../components/Icons'

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Alerts() {
  const list = publishableAlerts(alerts)
  const [params] = useSearchParams()
  const open = params.get('open')

  useEffect(() => {
    if (open) document.getElementById(open)?.scrollIntoView({ block: 'start' })
  }, [open])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Current scam alerts</h1>
        <p className="mt-2 text-muted">
          We only show an alert when at least two independent, credible sources report it. Each alert
          is reviewed by a person before it appears here.
        </p>
      </header>

      <ul className="space-y-4">
        {list.map((a) => (
          <li key={a.id} id={a.id} className="scroll-mt-4">
            <details open={open === a.id} className="group rounded-2xl border border-line bg-surface">
              <summary className="cursor-pointer list-none p-5 [&::-webkit-details-marker]:hidden">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {a.geography.map((g) => (
                    <span key={g} className="rounded-full bg-surface-2 px-2.5 py-1 text-muted">
                      {label(g)}
                    </span>
                  ))}
                  {a.channels.slice(0, 3).map((c) => (
                    <span key={c} className="rounded-full bg-brand-soft px-2.5 py-1 text-brand">
                      {label(c)}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 text-xl font-bold">{a.title}</h2>
                <p className="mt-1 text-muted">{a.summary}</p>
                <p className="mt-3 text-sm font-semibold text-brand">
                  <span className="group-open:hidden">Show warning signs and what to do</span>
                  <span className="hidden group-open:inline">Hide details</span>
                </p>
              </summary>

              <div className="space-y-5 border-t border-line p-5">
                <section>
                  <h3 className="font-bold">Warning signs</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-6">
                    {a.warning_signs.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-bold">How to check</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-6">
                    {a.verification_steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-bold">Sources</h3>
                  <ul className="mt-2 space-y-2">
                    {a.sources.map((s) => (
                      <li key={s.url} className="text-sm">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-1 font-medium text-brand underline underline-offset-4"
                        >
                          {s.title}
                          <ExternalIcon className="mt-1 shrink-0" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                        <span className="block text-muted">
                          {s.name}
                          {s.published && ` · ${formatDate(s.published)}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-muted">Last reviewed {formatDate(a.last_reviewed)}</p>
                </section>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  )
}
