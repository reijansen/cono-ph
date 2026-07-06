import { cn } from '@/utils/cn'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-brand-50 text-brand-800 hover:bg-brand-100',
  outline: 'border border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-300 hover:text-brand-700',
  ghost: 'text-[var(--app-text)] hover:bg-brand-50 hover:text-brand-800',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
