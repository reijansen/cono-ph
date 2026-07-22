export function normalizeFilterValues(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  if (value == null || value === '') return []
  return [String(value).trim()].filter(Boolean)
}

export function toggleFilterValue(value, option) {
  const values = normalizeFilterValues(value)
  return values.includes(option) ? values.filter((item) => item !== option) : [...values, option]
}

export function uniqueSortedOptions(rows, getter) {
  return Array.from(new Set(rows.flatMap((row) => normalizeFilterValues(getter(row)))))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
}

export function matchesAnyFilter(rowValue, selectedValues) {
  const selected = normalizeFilterValues(selectedValues)
  if (!selected.length) return true
  const rowValues = normalizeFilterValues(rowValue)
  return selected.some((value) => rowValues.includes(value))
}

export function removeFilterValue(value, option) {
  return normalizeFilterValues(value).filter((item) => item !== option)
}
