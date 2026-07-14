import { cn } from '@/utils/cn'

const variants = {
  primary: 'bg-brand-700 text-white shadow-[0_8px_20px_rgba(86,101,24,0.16)] hover:bg-brand-800',
  secondary: 'bg-brand-50 text-brand-800 hover:bg-brand-100',
  outline: 'border border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700',
  ghost: 'text-[var(--app-text)] hover:bg-brand-50 hover:text-brand-800',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-10 px-4.5 text-sm',
  lg: 'h-11 px-5 text-[0.95rem]',
}

export default function Button({
  as: Component = 'button',
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  children,
  ...props
}) {
  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
