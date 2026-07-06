import { cn } from '@/utils/cn'

export default function Card({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component
      className={cn(
        'rounded-2xl border border-[var(--app-border)] bg-white p-5 shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
