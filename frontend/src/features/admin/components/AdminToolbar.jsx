import { Filter, Plus, Search } from 'lucide-react'

export default function AdminToolbar({
  activeResource,
  filterColumns,
  filterColumn,
  filterValue,
  search,
  onCreate,
  onFilterColumnChange,
  onFilterValueChange,
  onSearchChange,
  onClearFilters,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-base-300 px-0 py-3 lg:px-4">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_180px_minmax(180px,0.8fr)_auto]">
          <label className="input input-sm input-bordered flex h-9 items-center gap-2 rounded-md bg-white">
            <Search className="h-4 w-4 text-base-content/50" />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search records"
              className="grow text-sm"
            />
          </label>

          <label className="select select-sm select-bordered flex h-9 items-center gap-2 rounded-md bg-white pl-3">
            <Filter className="h-4 w-4 shrink-0 text-base-content/50" />
            <select
              value={filterColumn}
              onChange={(event) => onFilterColumnChange(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            >
              <option value="">Filter field</option>
              {filterColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </label>

          <input
            type="text"
            value={filterValue}
            onChange={(event) => onFilterValueChange(event.target.value)}
            placeholder="Filter value"
            className="input input-sm input-bordered h-9 rounded-md bg-white"
            disabled={!filterColumn}
          />

          <button
            type="button"
            className="btn btn-outline btn-sm rounded-md"
            onClick={onClearFilters}
            disabled={!filterColumn && !filterValue}
          >
            Clear
          </button>
        </div>

        <button
          type="button"
          className="btn btn-sm rounded-md bg-brand-700 text-white hover:bg-brand-800"
          onClick={onCreate}
          disabled={!activeResource}
        >
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>
    </div>
  )
}
