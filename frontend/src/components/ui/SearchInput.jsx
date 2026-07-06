import { Search } from 'lucide-react'

import Input from '@/components/ui/Input'

export default function SearchInput({ className, ...props }) {
  return (
    <div className={className}>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)]" />
        <Input className="pl-11" type="search" {...props} />
      </label>
    </div>
  )
}
