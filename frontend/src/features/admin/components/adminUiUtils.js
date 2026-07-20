export const textareaColumns = new Set([
  'precursor_sequence',
  'signal_peptide',
  'propeptide_sequence',
  'mature_peptide_sequence',
  'post_peptide_sequence',
  'sequence',
  'authors',
  'title',
])

export function getInitialForm(resource, row = null) {
  return Object.fromEntries(resource.columns.map((column) => [column, row?.[column] ?? '']))
}

export function displayValue(value) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined || value === '') return 'Unavailable'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function getVisibleColumns(resource) {
  const preferred = [
    resource.idColumn,
    'scientific_name',
    'common_name',
    'species_name',
    'title',
    'marker_type',
    'superfamily',
    'province',
    'year_published',
    'status',
  ]
  const columns = preferred.filter((column) => resource.columns.includes(column))
  return Array.from(new Set(columns.length >= 4 ? columns : resource.columns.slice(0, 5)))
}

export function getFilterColumns(resource) {
  const preferred = [
    resource.idColumn,
    'province',
    'status',
    'subgenus',
    'species_name',
    'marker_type',
    'superfamily',
    'framework',
    'year_published',
    'journal',
    'class_name',
    'family_name',
    'genus_name',
  ]
  return Array.from(new Set(preferred.filter((column) => resource.columns.includes(column))))
}

export const fallbackDatasetLogsResource = {
  key: 'datasetLogs',
  label: 'Dataset Logs',
  idColumn: 'log_id',
  readOnly: true,
  columns: [
    'log_id',
    'resource_name',
    'original_filename',
    'imported_row_count',
    'created_count',
    'updated_count',
    'skipped_count',
    'status',
    'notes',
    'imported_by',
    'imported_at',
  ],
  required: ['log_id', 'resource_name'],
  types: {
    imported_row_count: 'number',
    created_count: 'number',
    updated_count: 'number',
    skipped_count: 'number',
  },
}

export function orderAdminResources(resources) {
  const order = ['species', 'conopeptides', 'biomarkers', 'publications', 'taxonomy', 'archive', 'datasetLogs']
  const byKey = new Map(resources.map((resource) => [resource.key, resource]))

  if (!byKey.has('datasetLogs')) {
    byKey.set('datasetLogs', fallbackDatasetLogsResource)
  }

  return order.map((key) => byKey.get(key)).filter(Boolean)
}
