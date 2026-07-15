import { NavLink } from 'react-router-dom'

import { navigationLinks } from '@/utils/navigation'
import { cn } from '@/utils/cn'

const primaryLinkOrder = ['Home', 'Conopeptides', 'Species', 'Biomarkers', 'Publications', 'Visualization', 'About']
const primaryLinks = primaryLinkOrder
  .map((label) => navigationLinks.find((link) => link.label === label))
  .filter(Boolean)

export default function PrimaryNav({ className, isSolid = false, mobile = false }) {
  return (
    <nav
      className={cn(
        mobile
          ? 'rounded-[1.5rem] px-4 py-4'
          : 'flex flex-nowrap items-center justify-center gap-x-3 whitespace-nowrap rounded-full px-4 py-2.5 transition-all duration-300 xl:gap-x-4 xl:px-6',
        isSolid
          ? 'border border-brand-800 bg-brand-700 shadow-[0_14px_36px_rgba(86,101,24,0.18)] backdrop-blur-xl'
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
                  ? 'rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-brand-50'
                  : 'px-1 py-1.5 text-[0.86rem] font-semibold transition xl:text-[0.9rem]',
                isSolid
                  ? 'text-white hover:text-white'
                  : 'text-black hover:text-brand-700',
                isActive &&
                  (mobile
                    ? isSolid
                      ? 'bg-brand-800 text-white'
                      : 'bg-brand-50 text-brand-700'
                    : isSolid
                      ? 'border-b-2 border-white text-white'
                      : 'border-b-2 border-brand-600 text-brand-700'),
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
