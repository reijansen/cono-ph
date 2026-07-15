const BIOMARKER_DETAIL_BACKUP_PATH = '/backup-data/json/barcodes/latest.json'

function normalizeRecord(record) {
  return {
    biomarkerId: String(record['Specimen ID'] ?? ''),
    title: String(record['Specimen ID'] ?? ''),
    subtitle: 'Biomarker Record',
    status: String(record['Validation Status of CO1 Sequences'] ?? 'Unavailable'),
    topSummaryItems: [
      { label: 'Species Name', value: String(record['Species Name'] ?? 'Unavailable') },
      { label: 'Specimen ID', value: String(record['Specimen ID'] ?? 'Unavailable') },
      { label: 'Gene Marker', value: String(record['Gene Marker'] ?? 'Unavailable') },
      { label: 'Sequence Length (bp)', value: String(record['Sequence Length (bp)'] ?? 'Unavailable') },
      { label: 'Collection Province', value: String(record['Province'] ?? 'Unavailable') },
      { label: 'Validation Status', value: String(record['Validation Status of CO1 Sequences'] ?? 'Unavailable') },
    ],
    overview: {
      fields: [
        { label: 'Biomarker ID', value: String(record['Specimen ID'] ?? 'Unavailable') },
        { label: 'Species Name', value: String(record['Species Name'] ?? 'Unavailable') },
        { label: 'Gene Marker', value: String(record['Gene Marker'] ?? 'Unavailable') },
        { label: 'External Accession', value: String(record['External Accession'] ?? 'Unavailable') },
        { label: 'Sequence Length (bp)', value: String(record['Sequence Length (bp)'] ?? 'Unavailable') },
        { label: 'Collection Province', value: String(record['Province'] ?? 'Unavailable') },
        { label: 'Validation Status', value: String(record['Validation Status of CO1 Sequences'] ?? 'Unavailable') },
        { label: 'Publication DOI', value: String(record['Publication DOI'] ?? 'Unavailable') },
      ],
    },
    sequenceTab: {
      sequence: String(record['Sequence'] ?? 'Unavailable'),
      length: String(record['Sequence Length (bp)'] ?? 'Unavailable'),
      translated: 'Unavailable',
      translatedNote: 'Rendered from backup data.',
      summaryItems: [
        { label: 'Sequence Length (bp)', value: String(record['Sequence Length (bp)'] ?? 'Unavailable') },
        { label: 'Source Method', value: String(record['Source Method'] ?? 'Unavailable') },
        { label: 'Sequence Completeness', value: String(record['Validation Status of CO1 Sequences'] ?? 'Unavailable') },
      ],
    },
    annotationsTab: {
      summary: 'Rendered from backup data.',
      items: [
        { label: 'Validation Status', value: String(record['Validation Status of CO1 Sequences'] ?? 'Unavailable') },
        { label: 'Gene Marker', value: String(record['Gene Marker'] ?? 'Unavailable') },
        { label: 'External Accession', value: String(record['External Accession'] ?? 'Unavailable') },
        { label: 'Coverage Note', value: String(record['Source Method'] ?? 'Unavailable') },
        { label: 'Source of Percent Similarity', value: 'Unavailable' },
        { label: 'Expression Value', value: 'Unavailable' },
        { label: 'Curated Annotation Remarks', value: String(record['Sequence Database'] ?? 'Unavailable') },
      ],
    },
    metadataTab: {
      rows: [
        { label: 'Biomarker ID', value: String(record['Specimen ID'] ?? 'Unavailable') },
        { label: 'Species Name', value: String(record['Species Name'] ?? 'Unavailable') },
        { label: 'Specimen ID', value: String(record['Specimen ID'] ?? 'Unavailable') },
        { label: 'Collection Province', value: String(record['Province'] ?? 'Unavailable') },
        { label: 'Collection Site (Municipality)', value: String(record['Municipality'] ?? 'Unavailable') },
        { label: 'Source Method', value: String(record['Source Method'] ?? 'Unavailable') },
        { label: 'Sequence Database', value: String(record['Sequence Database'] ?? 'Unavailable') },
        { label: 'Validation Status', value: String(record['Validation Status of CO1 Sequences'] ?? 'Unavailable') },
      ],
    },
  }
}

export async function loadBiomarkerBackupDetails() {
  const response = await fetch(BIOMARKER_DETAIL_BACKUP_PATH, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Backup biomarker data not found (${response.status})`)
  const records = await response.json()
  if (!Array.isArray(records)) throw new Error('Backup biomarker data is not an array')
  return records.map(normalizeRecord).filter((record) => record.biomarkerId)
}
