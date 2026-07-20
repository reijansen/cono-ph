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
