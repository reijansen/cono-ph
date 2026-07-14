import { ChevronDown } from 'lucide-react'

import { cn } from '@/utils/cn'

export default function SelectWithChevron({
  value,
  onChange,
  children,
  className,
  selectClassName,
  chevronClassName,
  ...props
}) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={onChange}
        className={cn(
          'h-10 w-full appearance-none rounded-[1.1rem] border border-[var(--app-border)] bg-white px-4 pr-12 text-sm text-[var(--app-text)] outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100',
          selectClassName,
        )}
        {...props}
      >
        {children}
      </select>

      <ChevronDown
        className={cn(
          'pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)] transition-transform duration-200',
          chevronClassName,
        )}
      />
    </div>
  )
}
