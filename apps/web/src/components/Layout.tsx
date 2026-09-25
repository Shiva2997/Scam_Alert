import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { BellIcon, CheckIcon, HelpIcon, HomeIcon, ListIcon, ShieldIcon } from './Icons'

const NAV = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/assess', label: 'Check', Icon: CheckIcon, end: false },
  { to: '/alerts', label: 'Alerts', Icon: BellIcon, end: false },
  { to: '/checklist', label: 'Checklist', Icon: ListIcon, end: false },
  { to: '/help', label: 'Get help', Icon: HelpIcon, end: false },
]

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  // On route change: scroll to top and move focus to main content for screen readers.
  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="min-h-dvh flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-brand no-underline">
            <ShieldIcon className="h-7 w-7" />
            <span className="text-lg tracking-tight text-ink">Scam Aware</span>
          </NavLink>
          <nav aria-label="Main" className="hidden sm:block">
            <ul className="flex gap-1">
              {NAV.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive ? 'bg-brand-soft text-brand' : 'text-muted hover:text-ink'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 pt-6 outline-none sm:pb-12"
      >
        <Outlet />
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 pb-28 text-xs text-muted sm:pb-8">
        <p>
          Scam Aware is decision support, not a guarantee. It cannot vouch for any person or
          request. Based on the Pause.Prove.Protect.™ framework by AI Communications Consulting.
          Nothing you enter leaves your device.
        </p>
      </footer>

      {/* Bottom tab bar on phones */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden"
      >
        <ul className="grid grid-cols-5">
          {NAV.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-[0.7rem] font-medium ${
                    isActive ? 'text-brand' : 'text-muted'
                  }`
                }
              >
                <Icon className="h-6 w-6" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
