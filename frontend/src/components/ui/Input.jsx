import { cn } from '@/utils/cn'

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-[1.1rem] border border-[var(--app-border)] bg-white px-4 text-sm text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-muted)] focus:border-brand-300 focus:ring-2 focus:ring-brand-100',
        className,
      )}
      {...props}
    />
  )
}
