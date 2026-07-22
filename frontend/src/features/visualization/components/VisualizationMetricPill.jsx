import { BarChart3, Database, Dna, FileCheck2, FileText, Layers3, MapPinned, Sprout } from 'lucide-react'

const icons = {
  'Total Species': Database,
  Subgenera: Layers3,
  Provinces: MapPinned,
  'Species with Sequence Data': Dna,
  'Conopeptide Precursors': Database,
  Superfamilies: Layers3,
  'Unique Peptides': Sprout,
  Biomarkers: BarChart3,
  'Total Biomarkers': BarChart3,
  'Biomarker Types': Layers3,
  'Species with Biomarker Data': Dna,
  'Biomarker Coverage': FileCheck2,
  Publications: FileText,
}

export default function VisualizationMetricPill({ metric }) {
  const Icon = metric.icon ?? icons[metric.label] ?? Database

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 border border-[var(--app-border)] bg-white p-4 sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[1.5rem] font-semibold tracking-tight text-[var(--app-text)] sm:text-[1.8rem]">{metric.value}</p>
        <p className="mt-1 truncate text-[0.85rem] font-semibold text-brand-700">{metric.label}</p>
        {metric.description ? <p className="mt-1 text-xs leading-5 text-[var(--app-muted)]">{metric.description}</p> : null}
      </div>
    </div>
  )
}
