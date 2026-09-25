import { resources } from '../data'
import { ExternalIcon } from '../components/Icons'

export default function Help() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Report it and get help</h1>
        <p className="mt-2 text-muted">
          Reporting helps stop scams and protect others — even if you didn't lose money.
        </p>
      </header>

      <section className="rounded-2xl border border-strong/30 bg-strong-soft p-5">
        <h2 className="font-bold text-strong">If you've already paid or shared details</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-6">
          <li>Call your bank or payment provider now, using the number on your card or their official app.</li>
          <li>Change any passwords you shared, and turn on two-step verification.</li>
          <li>Stop all contact with the scammer. Keep messages and receipts as evidence.</li>
          <li>Report it using the services below.</li>
        </ol>
        <p className="mt-3 text-sm">
          Being scammed is not your fault. These tactics fool careful, intelligent people every day.
        </p>
      </section>

      {resources.map((group) => (
        <section key={group.region} aria-labelledby={`r-${group.region}`}>
          <h2 id={`r-${group.region}`} className="text-xl font-bold">
            {group.label}
          </h2>
          <ul className="mt-3 grid gap-3">
            {group.items.map((item) => {
              const external = item.url?.startsWith('http')
              return (
                <li key={item.name} className="rounded-xl border border-line bg-surface p-4">
                  {item.url ? (
                    <a
                      href={item.url}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center gap-1 font-semibold text-brand underline underline-offset-4"
                    >
                      {item.name}
                      {external && (
                        <>
                          <ExternalIcon />
                          <span className="sr-only">(opens in a new tab)</span>
                        </>
                      )}
                    </a>
                  ) : (
                    <p className="font-semibold">{item.name}</p>
                  )}
                  <p className="mt-1 text-muted">{item.description}</p>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
