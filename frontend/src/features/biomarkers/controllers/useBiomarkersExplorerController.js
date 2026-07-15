import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

const biomarkerFilterOptions = {
  project: ['All Projects', 'ConoPH Core', 'Barcode Survey', 'Museum Reference Set'],
  markerType: ['All Marker Types', 'COI', '16S rRNA', '12S rRNA', 'H3', 'ITS', '28S rRNA'],
  species: ['All Species', 'Conus eburneus', 'Conus imperialis', 'Conus tessulatus', 'Conus miles'],
  province: ['All Provinces', 'Cebu', 'Bohol', 'Batangas', 'Palawan', 'Negros Occidental', 'Marinduque'],
  municipality: ['All Municipalities', 'Caw-oy', 'Sogod', 'Panglao', 'N/A'],
  status: ['Published', 'Under Review', 'Unpublished'],
  sequencingPlatform: ['All Platforms', 'Transcriptome-derived', 'PCR-based', 'GenBank', 'In-house database'],
}

const biomarkerExplorerInitialFilters = {
  search: '',
  project: 'All Projects',
  markerType: 'All Marker Types',
  species: 'All Species',
  province: 'All Provinces',
  municipality: 'All Municipalities',
  sequencingPlatform: 'All Platforms',
  status: [],
  hasAccession: false,
  hasSequenceData: false,
}

const biomarkerPagination = {
  page: 1,
  totalPages: 24,
}

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.markerType) && row.markerType !== filters.markerType) return false
  if (!isDefaultOption(filters.species) && row.species !== filters.species) return false
  if (!isDefaultOption(filters.province) && row.province !== filters.province) return false
  if ((filters.status || []).length > 0 && !filters.status.includes(row.status)) return false
  if (filters.hasAccession && row.accession === 'Unavailable') return false
  if (filters.hasSequenceData && row.sequenceLength === 'Unavailable') return false

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
        const backupRows = await loadBiomarkerBackupRows()
        if (active && backupRows.length > 0) {
          setRowsSource(backupRows)
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

  const rows = useMemo(
    () => rowsSource.filter((row) => rowMatchesFilters(row, filters)),
    [filters, rowsSource],
  )

  const resultCount = `${rows.length.toLocaleString()} results`

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
    filterOptions: biomarkerFilterOptions,
    handleFilterChange,
    handlePageChange,
    handleRowKeyDown,
    meta: biomarkerExplorerMeta,
    openBiomarker,
    pagination: { ...biomarkerPagination, page },
    resultCount,
    rows,
  }
}
