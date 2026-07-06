import { Link } from 'react-router-dom'

import { navigationLinks } from '@/utils/navigation'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--app-border)] bg-white">
      <div className="app-container py-6">
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-start">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-brand-800">ConoPH</p>
            <p className="max-w-md text-sm leading-6 text-[var(--app-muted)]">
              Philippine Cone Snail and Conopeptide Database
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[var(--app-muted)] transition hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 border-t border-[var(--app-border)] pt-4 text-sm text-[var(--app-muted)]">
          (c) {currentYear} ConoPH. Philippine Cone Snail and Conopeptide Database.
        </div>
      </div>
    </footer>
  )
}
