import { cn } from '@/utils/cn'

export default function Table({ columns = [], children, className }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--app-border)] text-left text-sm">
          <thead className="bg-brand-50/70 text-[var(--app-muted)]">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--app-border)]">{children}</tbody>
        </table>
      </div>
    </div>
  )
}
