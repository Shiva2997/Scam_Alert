import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions } from '../data'
import type { Answer } from '../types'
import { ArrowLeftIcon } from '../components/Icons'

const OPTIONS: { value: Answer; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'Not sure' },
]

export default function Assess() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})

  const q = questions[index]
  const total = questions.length
  const progress = Math.round((index / total) * 100)

  function choose(value: Answer) {
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    if (index + 1 < total) setIndex(index + 1)
    else navigate('/result', { state: { answers: next } })
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="sr-only">Check a request</h1>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => (index === 0 ? navigate('/') : setIndex(index - 1))}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-medium text-muted hover:text-ink"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </button>
        <p className="text-sm font-medium text-muted" aria-live="polite">
          Question {index + 1} of {total}
        </p>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
      </div>

      {index === 0 && (
        <p className="mt-6 rounded-xl bg-brand-soft p-4 text-sm">
          Think about the call, message or request you received. Answer as best you can — choose
          <strong> Not sure</strong> whenever you don't know. Your answers stay on this device.
        </p>
      )}

      <fieldset key={q.id} className="mt-6">
        <legend className="text-2xl font-bold leading-snug">{q.text}</legend>
        {q.hint && <p className="mt-2 text-muted">{q.hint}</p>}
        <div className="mt-6 grid gap-3">
          {OPTIONS.map((o) => {
            const selected = answers[q.id] === o.value
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => choose(o.value)}
                aria-pressed={selected}
                className={`min-h-14 rounded-xl border-2 px-5 text-left text-lg font-semibold transition-colors ${
                  selected
                    ? 'border-brand bg-brand-soft text-brand'
                    : 'border-line bg-surface hover:border-brand'
                }`}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
