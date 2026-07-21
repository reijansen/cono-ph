import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchSpeciesExplorerRows } from '@/services/catalogService'

const speciesPageSize = 5

export const speciesExplorerInitialFilters = {
  search: '',
  subgenus: 'All Subgenus',
  province: 'All Provinces',
  municipality: 'All Municipalities',
  diet: 'All Diet',
}

const isDefaultOption = (value) => !value || value.startsWith('All ')
const normalize = (value) => String(value ?? '').toLowerCase()
const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}
const uniqueOptions = (label, rows, field) => [
  label,
  ...Array.from(new Set(rows.map((row) => row[field]).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
]

function splitJoinedValues(value) {
  return String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinUniqueValues(values) {
  return Array.from(new Set(values.flatMap(splitJoinedValues))).join(', ')
}

function aggregateSpeciesRows(rows) {
  const grouped = new Map()

  rows.forEach((row) => {
    const key = normalize(row.scientificName || row.speciesId).trim()
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(row)
  })

  return Array.from(grouped.values())
    .map((group) => {
      const primary = group
        .slice()
        .sort((left, right) => String(left.speciesId).localeCompare(String(right.speciesId)))[0]
      const totalConopeptides = group.reduce(
        (sum, row) => sum + toNumber(row.precursorsCount ?? row.numConopeptides),
        0,
      )

      return {
        ...primary,
        speciesId: primary.speciesId,
        specimenIds: Array.from(
          new Set(group.flatMap((row) => (Array.isArray(row.specimenIds) && row.specimenIds.length ? row.specimenIds : [row.speciesId])).filter(Boolean)),
        ),
        specimenCount: group.reduce((count, row) => count + (row.specimenCount || 1), 0),
        province: joinUniqueValues(group.map((row) => row.province)),
        municipality: joinUniqueValues(group.map((row) => row.municipality)),
        sequencingPlatform: joinUniqueValues(group.map((row) => row.sequencingPlatform)),
        tissueSource: joinUniqueValues(group.map((row) => row.tissueSource)),
        precursorsCount: totalConopeptides,
        numConopeptides: totalConopeptides,
      }
    })
    .sort((left, right) => left.scientificName.localeCompare(right.scientificName))
}

function rowMatchesFilters(row, filters) {
  const searchTerm = normalize(filters.search).trim()
  const searchableText = normalize(Object.values(row).join(' '))

  if (searchTerm && !searchableText.includes(searchTerm)) return false
  if (!isDefaultOption(filters.subgenus) && !splitJoinedValues(row.subgenus).includes(filters.subgenus)) return false
  if (!isDefaultOption(filters.province) && !splitJoinedValues(row.province).includes(filters.province)) return false
  if (!isDefaultOption(filters.municipality) && !splitJoinedValues(row.municipality).includes(filters.municipality)) return false
  if (!isDefaultOption(filters.diet) && !splitJoinedValues(row.diet).includes(filters.diet)) return false

  return true
}

export function useSpeciesExplorerController() {
  const [filters, setFilters] = useState(speciesExplorerInitialFilters)
  const [page, setPage] = useState(1)
  const [recordsSource, setRecordsSource] = useState([])

  useEffect(() => {
    let active = true

    async function loadRecords() {
      try {
        const liveRecords = await fetchSpeciesExplorerRows()
        if (active) {
          setRecordsSource(aggregateSpeciesRows(liveRecords))
        }
      } catch {
        if (active) {
          setRecordsSource([])
        }
      }
    }

    loadRecords()

    return () => {
      active = false
    }
  }, [])

  const filteredRecords = useMemo(
    () => recordsSource.filter((row) => rowMatchesFilters(row, filters)),
    [filters, recordsSource],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / speciesPageSize))
  const records = useMemo(
    () => filteredRecords.slice((page - 1) * speciesPageSize, page * speciesPageSize),
    [filteredRecords, page],
  )
  const filterOptions = useMemo(
    () => ({
      subgenus: uniqueOptions('All Subgenus', recordsSource, 'subgenus'),
      province: uniqueOptions('All Provinces', recordsSource, 'province'),
      municipality: uniqueOptions('All Municipalities', recordsSource, 'municipality'),
      diet: uniqueOptions('All Diet', recordsSource, 'diet'),
    }),
    [recordsSource],
  )

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters)
    setPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
  }, [])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return {
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Species' },
    ],
    filters,
    filterOptions,
    handleFilterChange,
    handlePageChange,
    pagination: { page, totalPages },
    records,
    resultCount: filteredRecords.length,
  }
}
