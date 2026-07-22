import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchBiomarkerExplorerOptions, fetchBiomarkerExplorerRows } from '@/services/catalogService'

const pageSize = 10
const initialFilters = { search: '', markerType: '', species: '', province: '', status: [], hasAccession: false }

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase()
}

function hasUsableSequence(value) {
  const sequence = String(value ?? '').trim()
  const normalized = normalizeText(sequence)
  if (!sequence || ['unavailable', 'n/a', 'na', 'none', '-'].includes(normalized)) return false

  const compactSequence = sequence.toUpperCase().replace(/[\s.-]/g, '')
  return compactSequence.length >= 10 && /^[ACGTURYSWKMBDHVN]+$/.test(compactSequence)
}

function normalizeStatus(value) {
  const normalized = String(value ?? 'Unavailable').trim()
  return normalized === 'Putative' ? 'Partial' : normalized
}

function paginate(rows, page, limit = pageSize) {
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * limit

  return {
    rows: rows.slice(start, start + limit),
    pagination: { page: safePage, totalPages, total },
  }
}

export function useBiomarkersExplorerController() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [allRows, setAllRows] = useState([])
  const [filterOptions, setFilterOptions] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBiomarkerExplorerOptions().then(setFilterOptions).catch(() => setFilterOptions({})) }, [])
  useEffect(() => {
    let active = true
    setLoading(true)
    fetchBiomarkerExplorerRows()
      .then((rows) => { if (active) setAllRows(rows) })
      .catch(() => { if (active) setAllRows([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handleFilterChange = useCallback((nextFilters) => { setFilters({ ...initialFilters, ...nextFilters }); setPage(1) }, [])
  const openBiomarker = useCallback((biomarkerId) => navigate(`/biomarkers/${biomarkerId}`), [navigate])
  const handleRowKeyDown = useCallback((event, biomarkerId) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openBiomarker(biomarkerId) } }, [openBiomarker])

  const visibleRows = allRows.filter((row) => hasUsableSequence(row.sequence))
  const filteredRows = visibleRows.filter((row) => {
    const searchTerm = normalizeText(filters.search).trim()
    const searchable = normalizeText([row.biomarkerId, row.speciesId, row.speciesName, row.markerType, row.accession, row.sequence, row.province, row.validationStatus, row.publicationDoi].join(' '))

    if (searchTerm && !searchable.includes(searchTerm)) return false
    if (filters.markerType && !String(filters.markerType).startsWith('All ') && row.markerType !== filters.markerType) return false
    if (filters.species && !String(filters.species).startsWith('All ') && row.speciesName !== filters.species) return false
    if (filters.province && !String(filters.province).startsWith('All ') && row.province !== filters.province) return false
    if (Array.isArray(filters.status) && filters.status.length > 0 && !filters.status.includes(normalizeStatus(row.validationStatus))) return false
    if (filters.hasAccession && !String(row.accession ?? '').trim()) return false
    return true
  })
  const { rows, pagination } = paginate(filteredRows, page, pageSize)

  return {
    breadcrumbs: [{ label: 'Home', to: '/' }, { label: 'Biomarkers' }],
    filters: { ...filters, markerType: filters.markerType || 'All Marker Types', species: filters.species || 'All Species', province: filters.province || 'All Provinces' },
    filterOptions: { markerType: ['All Marker Types', ...(filterOptions.markerType || [])], species: ['All Species', ...(filterOptions.species || [])], province: ['All Provinces', ...(filterOptions.province || [])], status: filterOptions.status || [] },
    handleFilterChange, handlePageChange: setPage, handleRowKeyDown,
    meta: { title: 'Biomarkers Explorer', subtitle: 'Explore biomarker records, marker types, and linked sequence evidence from Philippine cone snails.' },
    openBiomarker, pagination, resultCount: loading ? 'Loading' : `${(pagination.total || 0).toLocaleString()} results`, rows,
  }
}
