import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchConopeptideExplorerRows } from '@/services/catalogService'

const conopeptideExplorerBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Conopeptides' },
]

const conopeptideExplorerMeta = {
  title: 'Conopeptides Explorer',
  subtitle: 'Explore conopeptide precursors and predicted mature peptides from Philippine cone snails.',
}

const conopeptidePageSize = 10
const conopeptidePagination = {
  page: 1,
  totalPages: 1,
}

export const conopeptideExplorerInitialFilters = {
  search: '',
  species: 'All Species',
  superfamily: 'All Superfamilies',
  cysteineFramework: 'All Cysteine Frameworks',
  hasMaturePeptideSequence: 'all',
}

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()
const hasUsableSequence = (value) => {
  const sequence = normalize(value).trim()
  return Boolean(sequence && !['unavailable', 'n/a', 'na', 'none', '-'].includes(sequence))
}
const uniqueOptions = (label, rows, field) => [
  label,
  ...Array.from(new Set(rows.map((row) => row[field]).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
]

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.species) && row.species !== filters.species) return false
  if (!isDefaultOption(filters.superfamily) && row.superfamily !== filters.superfamily) return false
  if (!isDefaultOption(filters.cysteineFramework) && row.framework !== filters.cysteineFramework) return false
  if (filters.hasMaturePeptideSequence === 'yes' && !hasUsableSequence(row.maturePeptideSequence)) return false

  return true
}

export function useConopeptidesExplorerController() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(conopeptideExplorerInitialFilters)
  const [page, setPage] = useState(conopeptidePagination.page)
  const [rowsSource, setRowsSource] = useState([])

  useEffect(() => {
    let active = true

    async function loadRows() {
      try {
        const liveRows = await fetchConopeptideExplorerRows()
        if (active) {
          setRowsSource(liveRows)
        }
      } catch {
        if (active) {
          setRowsSource([])
        }
      }
    }

    loadRows()

    return () => {
      active = false
    }
  }, [])

  const filteredRows = useMemo(
    () => rowsSource.filter((row) => rowMatchesFilters(row, filters)),
    [filters, rowsSource],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / conopeptidePageSize))
  const rows = useMemo(
    () => filteredRows.slice((page - 1) * conopeptidePageSize, page * conopeptidePageSize),
    [filteredRows, page],
  )
  const filterOptions = useMemo(
    () => ({
      species: uniqueOptions('All Species', rowsSource, 'species'),
      superfamily: uniqueOptions('All Superfamilies', rowsSource, 'superfamily'),
      cysteineFramework: uniqueOptions('All Cysteine Frameworks', rowsSource, 'framework'),
    }),
    [rowsSource],
  )

  const resultCount = `${filteredRows.length.toLocaleString()} results`

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
  }, [])

  const openConopeptide = useCallback(
    (accession) => {
      navigate(`/conopeptides/${accession}`)
    },
    [navigate],
  )

  const handleRowKeyDown = useCallback(
    (event, accession) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openConopeptide(accession)
      }
    },
    [openConopeptide],
  )

  return {
    breadcrumbs: conopeptideExplorerBreadcrumbs,
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    handleRowKeyDown,
    meta: conopeptideExplorerMeta,
    openConopeptide,
    pagination: { ...conopeptidePagination, page, totalPages },
    resultCount,
    rows,
  }
}
