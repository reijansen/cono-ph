import { cn } from '@/utils/cn'

export default function Card({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component
      className={cn(
        'rounded-[1.5rem] border border-[var(--app-border)] bg-white p-5 shadow-[0_10px_26px_rgba(16,16,16,0.04)]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
