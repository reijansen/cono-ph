import { NavLink } from 'react-router-dom'

import { navigationLinks } from '@/utils/navigation'
import { cn } from '@/utils/cn'

const primaryLinkOrder = ['Home', 'Conopeptides', 'Species', 'Biomarkers', 'Visualization', 'About']
const primaryLinks = primaryLinkOrder
  .map((label) => navigationLinks.find((link) => link.label === label))
  .filter(Boolean)

export default function PrimaryNav({ className, isSolid = false, mobile = false }) {
  return (
    <nav
      className={cn(
        mobile
          ? 'rounded-[1.5rem] px-4 py-4'
          : 'flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-full px-6 py-3 transition-all duration-300 lg:px-8',
        isSolid
          ? 'border border-black/5 bg-white/90 shadow-[0_14px_36px_rgba(0,0,0,0.1)] backdrop-blur-xl'
          : 'border border-transparent bg-transparent shadow-none backdrop-blur-0',
        className,
      )}
      aria-label="Primary"
    >
      <div className={cn(mobile ? 'flex flex-col gap-1' : 'contents')}>
        {primaryLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              cn(
                mobile
                  ? 'rounded-xl px-3 py-2 text-sm font-semibold text-black transition hover:bg-brand-50 hover:text-brand-700'
                  : 'text-[0.95rem] font-semibold text-black transition hover:text-brand-700',
                isActive && (mobile ? 'bg-brand-50 text-brand-700' : 'text-brand-700'),
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
