import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchBiomarkerExplorerRows } from '@/services/catalogService'
import { loadBiomarkerBackupRows } from '@/features/biomarkers/data/biomarkerBackupData'

const biomarkerExplorerBreadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Biomarkers' },
]

const biomarkerExplorerMeta = {
  title: 'Biomarkers Explorer',
  subtitle:
    'Explore biomarker records, marker types, and linked sequence evidence from Philippine cone snails.',
}

const biomarkerExplorerInitialFilters = {
  search: '',
  markerType: 'All Marker Types',
  species: 'All Species',
  province: 'All Provinces',
  status: [],
  hasAccession: false,
}

const biomarkerPageSize = 10
const biomarkerPagination = {
  page: 1,
  totalPages: 1,
}

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()
const uniqueOptions = (label, rows, field) => [
  label,
  ...Array.from(new Set(rows.map((row) => row[field]).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
]

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.markerType) && row.markerType !== filters.markerType) return false
  if (!isDefaultOption(filters.species) && row.species !== filters.species) return false
  if (!isDefaultOption(filters.province) && row.province !== filters.province) return false
  if ((filters.status || []).length > 0 && !filters.status.includes(row.status)) return false
  if (filters.hasAccession && row.accession === 'Unavailable') return false

  return true
}

export function useBiomarkersExplorerController() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(biomarkerExplorerInitialFilters)
  const [page, setPage] = useState(biomarkerPagination.page)
  const [rowsSource, setRowsSource] = useState([])

  useEffect(() => {
    let active = true

    async function loadRows() {
      try {
        const liveRows = await fetchBiomarkerExplorerRows()
        if (active && liveRows.length > 0) {
          setRowsSource(liveRows)
          return
        }
        const backupRows = await loadBiomarkerBackupRows()
        if (active && backupRows.length > 0) {
          setRowsSource(backupRows)
        }
      } catch {
        try {
          const backupRows = await loadBiomarkerBackupRows()
          if (active && backupRows.length > 0) {
            setRowsSource(backupRows)
          } else if (active) {
            setRowsSource([])
          }
        } catch {
          if (active) {
            setRowsSource([])
          }
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

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / biomarkerPageSize))
  const rows = useMemo(
    () => filteredRows.slice((page - 1) * biomarkerPageSize, page * biomarkerPageSize),
    [filteredRows, page],
  )
  const filterOptions = useMemo(
    () => ({
      markerType: uniqueOptions('All Marker Types', rowsSource, 'markerType'),
      species: uniqueOptions('All Species', rowsSource, 'species'),
      province: uniqueOptions('All Provinces', rowsSource, 'province'),
      status: Array.from(new Set(rowsSource.map((row) => row.status).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
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

  const openBiomarker = useCallback(
    (biomarkerId) => {
      navigate(`/biomarkers/${biomarkerId}`)
    },
    [navigate],
  )

  const handleRowKeyDown = useCallback(
    (event, biomarkerId) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openBiomarker(biomarkerId)
      }
    },
    [openBiomarker],
  )

  return {
    breadcrumbs: biomarkerExplorerBreadcrumbs,
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    handleRowKeyDown,
    meta: biomarkerExplorerMeta,
    openBiomarker,
    pagination: { ...biomarkerPagination, page, totalPages },
    resultCount,
    rows,
  }
}
