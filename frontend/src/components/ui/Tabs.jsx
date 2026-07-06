import { cn } from '@/utils/cn'

export default function Tabs({ tabs = [], activeTab, onChange, className }) {
  return (
    <div className={cn('flex flex-wrap gap-2 rounded-2xl border border-[var(--app-border)] bg-white p-2', className)}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange?.(tab.value)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-[var(--app-muted)] hover:bg-brand-50 hover:text-brand-800',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
