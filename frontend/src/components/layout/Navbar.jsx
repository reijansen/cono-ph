import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

import Button from '@/components/ui/Button'
import { navigationLinks } from '@/utils/navigation'
import { cn } from '@/utils/cn'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="border-b border-[var(--app-border)] bg-white/90 backdrop-blur">
      <div className="app-container">
        <div className="flex items-center justify-between gap-4 py-4">
          <NavLink to="/" end className="text-lg font-semibold tracking-tight text-brand-800">
            ConoPH
          </NavLink>

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-[var(--app-muted)] hover:bg-brand-50 hover:text-brand-800',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="ml-2">{isMenuOpen ? 'Close' : 'Menu'}</span>
          </Button>
        </div>

        <div
          id="mobile-menu"
          className={cn('lg:hidden', isMenuOpen ? 'pb-4' : 'hidden')}
        >
          <nav className="flex flex-col gap-2 border-t border-[var(--app-border)] pt-4" aria-label="Mobile primary">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-brand-50 text-[var(--app-text)] hover:bg-brand-100',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
