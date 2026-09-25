import { checklist } from '../data'
import { PHASE_META } from '../lib/phases'

export default function Checklist() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Pause. Prove. Protect.™ checklist</h1>
        <p className="mt-2 text-muted">
          Use this any time a call, message or request asks you to act. It works offline once this
          page has loaded.
        </p>
      </header>

      <ol className="space-y-4">
        {checklist.map((section, i) => {
          const { Icon, text, bg } = PHASE_META[section.phase]
          return (
            <li key={section.phase} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${bg} ${text}`}>
                  <Icon />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${text}`}>
                    <span className="sr-only">Step {i + 1}: </span>
                    {section.title}
                  </h2>
                  <p className="text-muted">{section.tagline}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className={`mt-2.5 h-2 w-2 shrink-0 rounded-full ${bg} ring-2 ring-current ${text}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>

      <button
        type="button"
        onClick={() => window.print()}
        className="min-h-12 rounded-xl border-2 border-line bg-surface px-5 font-semibold print:hidden"
      >
        Print this checklist
      </button>
    </div>
  )
}
