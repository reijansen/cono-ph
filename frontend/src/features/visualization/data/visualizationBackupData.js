import { loadBiomarkerBackupRows } from '@/features/biomarkers/data/biomarkerBackupData'
import { loadConopeptideBackupRows } from '@/features/conopeptides/data/conopeptideBackupData'
import { loadPublicationBackupRows } from '@/features/publications/data/publicationBackupData'
import { loadSpeciesBackupRecords } from '@/features/species/data/speciesBackupData'
import {
  FiBarChart2,
  FiBookOpen,
  FiDatabase,
  FiFeather,
  FiPieChart,
} from 'react-icons/fi'

function countBy(items, getter) {
  const counts = new Map()
  for (const item of items) {
    const key = String(getter(item) || '').trim()
    if (!key) continue
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return counts
}

function topEntriesFromCountMap(counts, limit = 5) {
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name))
    .slice(0, limit)
}

function entriesFromCountMap(counts) {
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name))
}

function buildSpeciesProvinceCoverage(speciesRows) {
  return entriesFromCountMap(countBy(speciesRows, (row) => row.province || 'Unknown')).map((item) => ({
    label: item.name,
    value: item.value,
  }))
}

function buildConopeptideLengthBins(conopeptideRows) {
  const lengths = conopeptideRows
    .map((row) => (row.predictedPeptide ? row.predictedPeptide.length : 0))
    .filter((length) => length > 0)

  if (!lengths.length) {
    return []
  }

  const minLength = Math.min(...lengths)
  const maxLength = Math.max(...lengths)
  const binSize = 20
  const start = Math.floor(minLength / binSize) * binSize
  const end = Math.ceil(maxLength / binSize) * binSize
  const bins = []

  for (let lower = start; lower <= end; lower += binSize) {
    const upper = lower + binSize - 1
    bins.push({ label: `${lower}-${upper} aa`, min: lower, max: upper, value: 0 })
  }

  for (const length of lengths) {
    const bin = bins.find((item) => length >= item.min && length <= item.max)
    if (bin) {
      bin.value += 1
    }
  }

  return bins.filter((bin) => bin.value > 0).map(({ label, value }) => ({ label, value }))
}

function safeTopLabel(entries, fallback = 'Unavailable') {
  return entries[0]?.name ?? fallback
}

function safeTopValue(entries, fallback = 0) {
  return entries[0]?.value ?? fallback
}

function countNonEmpty(rows, getter) {
  return rows.reduce((total, row) => total + (String(getter(row) || '').trim() ? 1 : 0), 0)
}

export async function loadVisualizationBackupData() {
  const [speciesRows, conopeptideRows, biomarkerRows, publicationRows] = await Promise.all([
    loadSpeciesBackupRecords(),
    loadConopeptideBackupRows(),
    loadBiomarkerBackupRows(),
    loadPublicationBackupRows(),
  ])

  const speciesCount = speciesRows.length
  const conopeptideCount = conopeptideRows.length
  const biomarkerCount = biomarkerRows.length
  const speciesWithBiomarkerData = new Set(biomarkerRows.map((row) => row.species).filter(Boolean)).size
  const speciesWithConopeptides = new Set(conopeptideRows.map((row) => row.species).filter(Boolean)).size
  const publicationCount = publicationRows.length

  const speciesCountsByName = topEntriesFromCountMap(countBy(speciesRows, (row) => row.scientificName), 5)
  const conopeptideCountsBySpecies = topEntriesFromCountMap(countBy(conopeptideRows, (row) => row.species), 5)
  const biomarkerCountsBySpecies = topEntriesFromCountMap(countBy(biomarkerRows, (row) => row.species), 5)
  const provinceCounts = entriesFromCountMap(countBy([...speciesRows, ...biomarkerRows], (row) => row.province || 'Unknown'))
  const superfamilyCounts = entriesFromCountMap(countBy(conopeptideRows, (row) => row.superfamily || 'Unknown')).slice(0, 6)
  const markerTypeCounts = entriesFromCountMap(countBy(biomarkerRows, (row) => row.markerType || 'Unknown')).slice(0, 6)
  const linkedSpeciesCoverage = countNonEmpty(publicationRows, (row) => row.linkedSpecies)
  const linkedConopeptideCoverage = countNonEmpty(publicationRows, (row) => row.linkedConopeptides)
  const linkedBiomarkerCoverage = countNonEmpty(publicationRows, (row) => row.linkedBiomarkers)
  const topSpeciesName = safeTopLabel(speciesCountsByName)
  const topConopeptideSpecies = safeTopLabel(conopeptideCountsBySpecies)
  const topBiomarkerSpecies = safeTopLabel(biomarkerCountsBySpecies)
  const topSpeciesCount = safeTopValue(speciesCountsByName)
  const topConopeptideCount = safeTopValue(conopeptideCountsBySpecies)
  const topBiomarkerCount = safeTopValue(biomarkerCountsBySpecies)

  return {
    metrics: [
      {
        icon: FiDatabase,
        label: 'Total Species',
        value: String(speciesCount),
      },
      {
        icon: FiFeather,
        label: 'Conopeptide Precursors',
        value: String(conopeptideCount),
      },
      {
        icon: FiBarChart2,
        label: 'Biomarkers',
        value: String(biomarkerCount),
      },
      {
        icon: FiBookOpen,
        label: 'Publications',
        value: String(publicationCount),
      },
      {
        icon: FiPieChart,
        label: 'Biomarker Coverage',
        value: speciesCount > 0 ? `${Math.round((speciesWithBiomarkerData / speciesCount) * 100)}%` : '0%',
      },
    ],
    overviewCards: [
      {
        id: 'species',
        title: '1. Species Overview',
        viewAllLabel: 'View all',
        viewAllTo: '/visualization/species',
        previewTitle: 'Species Distribution by Province',
        previewAlt: 'Species distribution by province',
        listTitle: 'Top 5 Most Sequenced Species',
        listItems: speciesCountsByName.map((item) => ({ name: item.name, value: String(item.value) })),
        ctaLabel: 'Explore Species',
        ctaTo: '/visualization/species',
        icon: null,
        metricValue: String(topSpeciesCount),
        metricDescription: topSpeciesName,
        chartData: buildSpeciesProvinceCoverage(speciesRows).map((item) => ({ name: item.label, value: item.value })),
      },
      {
        id: 'conopeptides',
        title: '2. Conopeptide Overview',
        viewAllLabel: 'View all',
        viewAllTo: '/visualization/conopeptides',
        previewTitle: 'Conopeptide Superfamily Distribution',
        previewAlt: 'Conopeptide superfamily distribution',
        listTitle: 'Top Species',
        listItems: conopeptideCountsBySpecies.map((item) => ({ name: item.name, value: String(item.value) })),
        ctaLabel: 'Explore Conopeptides',
        ctaTo: '/visualization/conopeptides',
        icon: null,
        metricValue: String(topConopeptideCount),
        metricDescription: topConopeptideSpecies,
        chartData: superfamilyCounts.map((item) => ({ name: item.name, value: item.value })),
      },
      {
        id: 'biomarkers',
        title: '3. Biomarker Overview',
        viewAllLabel: 'View all',
        viewAllTo: '/visualization/biomarkers',
        previewTitle: 'Marker Type Distribution',
        previewAlt: 'Marker type distribution',
        listTitle: 'Top Species',
        listItems: biomarkerCountsBySpecies.map((item) => ({ name: item.name, value: String(item.value) })),
        ctaLabel: 'Explore Biomarkers',
        ctaTo: '/visualization/biomarkers',
        icon: null,
        metricValue: String(topBiomarkerCount),
        metricDescription: topBiomarkerSpecies,
        chartData: markerTypeCounts.map((item) => ({ name: item.name, value: item.value })),
      },
    ],
    speciesAreaData: buildSpeciesProvinceCoverage(speciesRows).map((item) => ({
      province: item.label,
      Species: item.value,
    })),
    biomarkerBarData: provinceCounts.slice(0, 5).map((item) => ({
      name: item.name,
      value: item.value,
    })),
    conopeptideLineData: buildConopeptideLengthBins(conopeptideRows).map((item) => ({
      range: item.label,
      count: item.value,
    })),
    biomarkerCoverageData: [
      { label: 'Species with biomarker data', value: speciesWithBiomarkerData },
      { label: 'Species without biomarker data', value: Math.max(speciesCount - speciesWithBiomarkerData, 0) },
    ],
    crossDataInsights: {
      summary: [
        {
          label: 'Species with biomarkers',
          value: String(speciesWithBiomarkerData),
          hint: speciesCount > 0 ? `${Math.round((speciesWithBiomarkerData / speciesCount) * 100)}% of the species set` : 'No species loaded',
        },
        {
          label: 'Species with conopeptides',
          value: String(speciesWithConopeptides),
          hint: `${publicationCount} publication records in the same snapshot`,
        },
        {
          label: 'Linked publications',
          value: String(linkedSpeciesCoverage + linkedConopeptideCoverage + linkedBiomarkerCoverage),
          hint: 'Cross-links captured across the loaded records',
        },
      ],
      highlights: [
        {
          title: 'Coverage focus',
          body: `Biomarker records span ${speciesWithBiomarkerData} species and ${linkedBiomarkerCoverage} linked publication entries.`,
        },
        {
          title: 'Species signal',
          body: `Top species leaders are ${topSpeciesName}, ${topConopeptideSpecies}, and ${topBiomarkerSpecies}.`,
        },
        {
          title: 'Evidence links',
          body: `Cross-record links captured: species ${linkedSpeciesCoverage}, conopeptides ${linkedConopeptideCoverage}, biomarkers ${linkedBiomarkerCoverage}.`,
        },
      ],
    },
  }
}
