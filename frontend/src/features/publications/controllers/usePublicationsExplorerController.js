import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchPublicationExplorerRows } from '@/services/catalogService'
import { matchesAnyFilter, normalizeFilterValues, uniqueSortedOptions } from '@/utils/multiSelectFilters'

const pageSize = 5
const initialFilters = { search: '', year: [], journal: [] }
function normalize(value) { return String(value ?? '').trim().toLowerCase() }

export function usePublicationsExplorerController() {
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [allRows, setAllRows] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; fetchPublicationExplorerRows().then((rows) => { if (active) setAllRows(rows) }).catch(() => { if (active) setAllRows([]) }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [])
  const filteredRows = useMemo(() => allRows.filter((row) => { const search = normalize(filters.search); const searchable = normalize([row.id, row.title, row.authors, row.journal, row.doi, row.evidenceType, row.year].join(' ')); return (!search || searchable.includes(search)) && matchesAnyFilter(row.year, filters.year) && matchesAnyFilter(row.journal, filters.journal) }), [allRows, filters])
  const pagination = useMemo(() => { const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize)); return { page: Math.min(page, totalPages), totalPages, total: filteredRows.length } }, [filteredRows.length, page])
  const rows = useMemo(() => filteredRows.slice((pagination.page - 1) * pageSize, pagination.page * pageSize), [filteredRows, pagination.page])
  const filterOptions = useMemo(() => ({ year: uniqueSortedOptions(allRows, (row) => row.year).sort((a, b) => b.localeCompare(a, undefined, { numeric: true })), journal: uniqueSortedOptions(allRows, (row) => row.journal) }), [allRows])
  const handleFilterChange = useCallback((nextFilters) => { setFilters({ ...initialFilters, ...nextFilters, year: normalizeFilterValues(nextFilters.year), journal: normalizeFilterValues(nextFilters.journal) }); setPage(1) }, [])
  useEffect(() => { setPage((current) => Math.min(current, pagination.totalPages)) }, [pagination.totalPages])
  return { breadcrumbs: [{ label: 'Home', to: '/' }, { label: 'Publications' }], filters, filterOptions, handleFilterChange, handlePageChange: setPage, meta: { title: 'Publications Explorer', subtitle: 'Browse publications linked to Philippine cone snail, conopeptide, and biomarker evidence.' }, pagination, resultCount: loading ? 'Loading data...' : `${pagination.total.toLocaleString()} results`, rows }
}
