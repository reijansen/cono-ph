import Card from '@/components/ui/Card'

export default function EmptyState({ title, description, action, className }) {
  return (
    <Card className={className}>
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="h-12 w-12 rounded-full bg-brand-50" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[var(--app-text)]">{title}</h3>
          {description ? <p className="text-sm text-[var(--app-muted)]">{description}</p> : null}
        </div>
        {action ? <div className="pt-1">{action}</div> : null}
      </div>
    </Card>
  )
}
