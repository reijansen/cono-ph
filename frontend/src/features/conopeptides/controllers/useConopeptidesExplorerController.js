import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchConopeptideExplorerRows } from '@/services/catalogService'
import { matchesAnyFilter, normalizeFilterValues, uniqueSortedOptions } from '@/utils/multiSelectFilters'

const pageSize = 10
export const conopeptideExplorerInitialFilters = { search: '', species: [], superfamily: [], cysteineFramework: [], hasMaturePeptideSequence: false }
function normalize(value) { return String(value ?? '').trim().toLowerCase() }

export function useConopeptidesExplorerController() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(conopeptideExplorerInitialFilters)
  const [page, setPage] = useState(1)
  const [allRows, setAllRows] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; fetchConopeptideExplorerRows().then((rows) => { if (active) setAllRows(rows) }).catch(() => { if (active) setAllRows([]) }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [])

  const filteredRows = useMemo(() => allRows.filter((row) => {
    const search = normalize(filters.search)
    const searchable = normalize([row.accession, row.species, row.superfamily, row.framework, row.predictedPeptide, row.maturePeptideSequence, row.matchedToxin, row.doi].join(' '))
    const hasSequence = String(row.maturePeptideSequence ?? '').trim() && !['unavailable', 'n/a', 'na', 'none', '-'].includes(normalize(row.maturePeptideSequence))
    return (!search || searchable.includes(search)) && matchesAnyFilter(row.species, filters.species) && matchesAnyFilter(row.superfamily, filters.superfamily) && matchesAnyFilter(row.framework, filters.cysteineFramework) && (!filters.hasMaturePeptideSequence || hasSequence)
  }), [allRows, filters])
  const pagination = useMemo(() => { const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize)); const safePage = Math.min(page, totalPages); return { page: safePage, totalPages, total: filteredRows.length } }, [filteredRows.length, page])
  const rows = useMemo(() => filteredRows.slice((pagination.page - 1) * pageSize, pagination.page * pageSize), [filteredRows, pagination.page])
  const filterOptions = useMemo(() => ({ species: uniqueSortedOptions(allRows, (row) => row.species), superfamily: uniqueSortedOptions(allRows, (row) => row.superfamily), cysteineFramework: uniqueSortedOptions(allRows, (row) => row.framework) }), [allRows])
  const handleFilterChange = useCallback((nextFilters) => { setFilters({ ...conopeptideExplorerInitialFilters, ...nextFilters, species: normalizeFilterValues(nextFilters.species), superfamily: normalizeFilterValues(nextFilters.superfamily), cysteineFramework: normalizeFilterValues(nextFilters.cysteineFramework) }); setPage(1) }, [])
  const openConopeptide = useCallback((accession) => navigate(`/conopeptides/${accession}`), [navigate])
  const handleRowKeyDown = useCallback((event, accession) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openConopeptide(accession) } }, [openConopeptide])
  useEffect(() => { setPage((current) => Math.min(current, pagination.totalPages)) }, [pagination.totalPages])
  return { breadcrumbs: [{ label: 'Home', to: '/' }, { label: 'Conopeptides' }], filters, filterOptions, handleFilterChange, handlePageChange: setPage, handleRowKeyDown, meta: { title: 'Conopeptides Explorer', subtitle: 'Explore conopeptide precursors and predicted mature peptides from Philippine cone snails.' }, openConopeptide, pagination, resultCount: loading ? 'Loading data...' : `${pagination.total.toLocaleString()} results`, rows }
}
