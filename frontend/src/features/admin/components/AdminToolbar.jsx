import { Filter, Plus, Search, Upload } from 'lucide-react'

export default function AdminToolbar({
  activeResource,
  filterColumns,
  filterColumn,
  filterValue,
  search,
  onCreate,
  onImport,
  onFilterColumnChange,
  onFilterValueChange,
  onSearchChange,
  onClearFilters,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-base-300 px-0 py-3 lg:px-4">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_190px_minmax(180px,0.8fr)_auto]">
          <label className="input input-sm input-bordered flex h-9 items-center gap-2 rounded-md bg-white">
            <Search className="h-4 w-4 text-base-content/50" />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onSearchChange(event.currentTarget.value)
              }}
              placeholder="Search records"
              className="grow text-sm"
            />
          </label>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/50" />
            <select
              value={filterColumn}
              onChange={(event) => onFilterColumnChange(event.target.value)}
              className="select select-sm select-bordered h-9 w-full rounded-md bg-white pl-9 text-sm"
            >
              <option value="">Filter field</option>
              {filterColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

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
            disabled={!search && !filterColumn && !filterValue}
          >
            Clear
          </button>
        </div>

        <div className="flex gap-2">
          {!activeResource?.readOnly ? (
            <button type="button" className="btn btn-outline btn-sm rounded-md gap-2" onClick={onImport}>
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-sm rounded-md bg-brand-700 text-white hover:bg-brand-800"
            onClick={onCreate}
            disabled={!activeResource || activeResource.readOnly}
          >
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>
      </div>
    </div>
  )
}
