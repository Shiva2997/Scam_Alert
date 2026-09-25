import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Result from '../src/pages/Result'
import { questions } from '../src/data'
import type { Answer } from '../src/types'

function renderResult(answers: Record<string, Answer>) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/result', state: { answers } }]}>
      <Routes>
        <Route path="/result" element={<Result />} />
        <Route path="/assess" element={<p>assessment page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

const all = (a: Answer) => Object.fromEntries(questions.map((q) => [q.id, a]))

describe('<Result />', () => {
  it('shows strong warning signs and explains each flag', () => {
    renderResult({ ...all('no'), payment_method: 'yes' })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Strong warning signs')
    expect(screen.getByText('Hard-to-reverse payment method')).toBeInTheDocument()
  })

  it('with no warning signs, still does not call the request safe and shows the disclaimer', () => {
    const { container } = renderResult(all('no'))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Few warning signs found')
    expect(container.textContent).not.toMatch(/\b(is|looks|seems)\s+(safe|genuine|legitimate)\b/i)
    expect(screen.getByText(/decision support, not a guarantee/i)).toBeInTheDocument()
  })

  it('always shows all three Pause / Prove / Protect sections', () => {
    renderResult(all('no'))
    for (const label of ['Pause', 'Prove', 'Protect']) expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('redirects to the assessment when opened without answers', () => {
    render(
      <MemoryRouter initialEntries={['/result']}>
        <Routes>
          <Route path="/result" element={<Result />} />
          <Route path="/assess" element={<p>assessment page</p>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('assessment page')).toBeInTheDocument()
  })
})
