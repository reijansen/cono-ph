import { cn } from '@/utils/cn'

const variants = {
  default: 'bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200',
  success: 'bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200',
  neutral: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200',
}

export default function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
