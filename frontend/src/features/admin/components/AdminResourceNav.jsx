import { cn } from '@/utils/cn'

export default function AdminResourceNav({ resources, activeResourceKey, onSelect }) {
  return (
    <nav className="border-b border-base-300 py-2 lg:border-b-0 lg:border-r">
      <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
        {resources.map((resource) => (
          <button
            key={resource.key}
            type="button"
            onClick={() => onSelect(resource.key)}
            className={cn(
              'btn btn-ghost btn-sm h-auto min-h-0 whitespace-nowrap rounded-md px-3 py-2 font-normal lg:w-full lg:justify-start',
              resource.key === activeResourceKey
                ? 'bg-brand-50 font-semibold text-brand-800 hover:bg-brand-50'
                : 'text-base-content/60 hover:bg-brand-50/60 hover:text-base-content',
            )}
          >
            {resource.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
