import { loadBiomarkerBackupRows } from '@/features/biomarkers/data/biomarkerBackupData'
import { loadConopeptideBackupRows } from '@/features/conopeptides/data/conopeptideBackupData'
import { loadPublicationBackupRows } from '@/features/publications/data/publicationBackupData'
import { loadSpeciesBackupRecords } from '@/features/species/data/speciesBackupData'

const provinceOrder = [
  'Cebu',
  'Bohol',
  'Palawan',
  'Marinduque',
  'Samar',
  'Batangas',
  'Negros Occidental',
  'Other',
]

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

function buildSpeciesProvinceCoverage(speciesRows) {
  const counts = countBy(speciesRows, (row) => row.province || 'Other')
  return provinceOrder.map((label) => ({ label, value: counts.get(label) || 0 }))
}

function buildConopeptideLengthBins(conopeptideRows) {
  const bins = [
    { label: '40-60 aa', min: 40, max: 60, value: 0 },
    { label: '61-80 aa', min: 61, max: 80, value: 0 },
    { label: '81-100 aa', min: 81, max: 100, value: 0 },
    { label: '101-120 aa', min: 101, max: 120, value: 0 },
    { label: '121-140 aa', min: 121, max: 140, value: 0 },
    { label: '141+ aa', min: 141, max: Number.POSITIVE_INFINITY, value: 0 },
  ]

  for (const row of conopeptideRows) {
    const length = (row.predictedPeptide || '').length
    const bin = bins.find((item) => length >= item.min && length <= item.max)
    if (bin) {
      bin.value += 1
    }
  }

  return bins.map(({ label, value }) => ({ label, value }))
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

  const speciesCountsByName = topEntriesFromCountMap(countBy(speciesRows, (row) => row.scientificName), 5)
  const conopeptideCountsBySpecies = topEntriesFromCountMap(countBy(conopeptideRows, (row) => row.species), 5)
  const biomarkerCountsBySpecies = topEntriesFromCountMap(countBy(biomarkerRows, (row) => row.species), 5)

  return {
    metrics: [
      {
        label: 'Total Species',
        value: String(speciesCount),
        description: 'Across the loaded species backup records.',
      },
      {
        label: 'Conopeptide Precursors',
        value: String(conopeptideCount),
        description: 'From the conopeptide backup JSON.',
      },
      {
        label: 'Biomarkers',
        value: String(biomarkerCount),
        description: 'From the barcode/biomarker backup JSON.',
      },
      {
        label: 'Biomarker Coverage',
        value: speciesCount > 0 ? `${Math.round((speciesWithBiomarkerData / speciesCount) * 100)}%` : '0%',
        description: 'Species with at least one biomarker record.',
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
        chartData: buildSpeciesProvinceCoverage(speciesRows).map((item) => ({
          name: item.label,
          value: item.value,
        })),
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
        chartData: topEntriesFromCountMap(countBy(conopeptideRows, (row) => row.superfamily), 6).map((item) => ({
          name: item.name,
          value: item.value,
        })),
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
        chartData: topEntriesFromCountMap(countBy(biomarkerRows, (row) => row.markerType), 6).map((item) => ({
          name: item.name,
          value: item.value,
        })),
      },
    ],
    insights: [
      `Loaded ${speciesCount} species, ${conopeptideCount} conopeptides, and ${biomarkerCount} biomarkers from backup JSON.`,
      `Species with biomarker records: ${speciesWithBiomarkerData}. Species with conopeptides: ${speciesWithConopeptides}.`,
      `Most common species in the data snapshot: ${speciesCountsByName[0]?.name ?? 'Unavailable'}.`,
    ],
    speciesAreaData: buildSpeciesProvinceCoverage(speciesRows).map((item) => ({
      province: item.label,
      Species: item.value,
    })),
    biomarkerBarData: topEntriesFromCountMap(countBy(biomarkerRows, (row) => row.province || 'Other'), 5).map((item) => ({
      name: item.name,
      biomarker: item.value,
    })),
    conopeptideLineData: buildConopeptideLengthBins(conopeptideRows).map((item) => ({
      range: item.label,
      count: item.value,
    })),
    biomarkerCoverageData: [
      { label: 'Species with biomarker data', value: speciesWithBiomarkerData },
      { label: 'Species without biomarker data', value: Math.max(speciesCount - speciesWithBiomarkerData, 0) },
    ],
  }
}
