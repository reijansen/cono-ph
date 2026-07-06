import { Link } from 'react-router-dom'

import { navigationLinks } from '@/utils/navigation'

export default function NavbarPlaceholder() {
  return (
    <nav aria-label="Primary">
      <div className="app-container py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>ConoPH</span>
          <div className="flex flex-wrap gap-3">
            {navigationLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
