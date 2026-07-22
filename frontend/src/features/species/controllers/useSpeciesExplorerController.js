import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchSpeciesExplorerRows } from '@/services/catalogService'
import { matchesAnyFilter, normalizeFilterValues, uniqueSortedOptions } from '@/utils/multiSelectFilters'

const pageSize = 5
export const speciesExplorerInitialFilters = { search: '', subgenus: [], province: [], municipality: [], diet: [] }

function normalize(value) { return String(value ?? '').trim().toLowerCase() }
function paginate(rows, page) {
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  return { rows: rows.slice((safePage - 1) * pageSize, safePage * pageSize), pagination: { page: safePage, totalPages, total } }
}

export function useSpeciesExplorerController() {
  const [filters, setFilters] = useState(speciesExplorerInitialFilters)
  const [page, setPage] = useState(1)
  const [allRows, setAllRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchSpeciesExplorerRows().then((rows) => { if (active) setAllRows(rows) }).catch(() => { if (active) setAllRows([]) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredRows = useMemo(() => allRows.filter((row) => {
    const search = normalize(filters.search)
    const searchable = normalize([row.speciesId, row.scientificName, row.commonName, row.subgenus, row.province, row.municipality, row.diet, row.project, row.doi].join(' '))
    return (!search || searchable.includes(search)) && matchesAnyFilter(row.subgenus, filters.subgenus) && matchesAnyFilter(row.province, filters.province) && matchesAnyFilter(row.municipality, filters.municipality) && matchesAnyFilter(row.diet, filters.diet)
  }), [allRows, filters])
  const paginated = useMemo(() => paginate(filteredRows, page), [filteredRows, page])
  const filterOptions = useMemo(() => ({
    subgenus: uniqueSortedOptions(allRows, (row) => row.subgenus),
    province: uniqueSortedOptions(allRows, (row) => row.province),
    municipality: uniqueSortedOptions(allRows, (row) => row.municipality),
    diet: uniqueSortedOptions(allRows, (row) => row.diet),
  }), [allRows])

  const handleFilterChange = useCallback((nextFilters) => { setFilters({ ...speciesExplorerInitialFilters, ...nextFilters, subgenus: normalizeFilterValues(nextFilters.subgenus), province: normalizeFilterValues(nextFilters.province), municipality: normalizeFilterValues(nextFilters.municipality), diet: normalizeFilterValues(nextFilters.diet) }); setPage(1) }, [])
  useEffect(() => { setPage((current) => Math.min(current, paginated.pagination.totalPages)) }, [paginated.pagination.totalPages])

  return {
    breadcrumbs: [{ label: 'Home', to: '/' }, { label: 'Species' }],
    filters, filterOptions, handleFilterChange, handlePageChange: setPage,
    pagination: { ...paginated.pagination, page }, records: paginated.rows,
    resultCount: loading ? 'Loading' : `${paginated.pagination.total.toLocaleString()} results`,
  }
}
