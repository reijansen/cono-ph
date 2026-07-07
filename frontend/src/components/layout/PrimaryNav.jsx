import { NavLink } from 'react-router-dom'

import { navigationLinks } from '@/utils/navigation'
import { cn } from '@/utils/cn'

const primaryLinkOrder = ['Home', 'Conopeptides', 'Species', 'Biomarkers', 'Visualization', 'About']
const primaryLinks = primaryLinkOrder
  .map((label) => navigationLinks.find((link) => link.label === label))
  .filter(Boolean)

export default function PrimaryNav({ className, isSolid = false }) {
  return (
    <nav
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-full px-6 py-4 transition-all duration-300 lg:px-10',
        isSolid
          ? 'border border-black/5 bg-white/90 shadow-[0_14px_36px_rgba(0,0,0,0.1)] backdrop-blur-xl'
          : 'border border-transparent bg-transparent shadow-none backdrop-blur-0',
        className,
      )}
      aria-label="Primary"
    >
      {primaryLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          end={link.path === '/'}
          className={({ isActive }) =>
            cn(
              'text-[0.98rem] font-semibold text-black transition hover:text-brand-700',
              isActive && 'text-brand-700',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
