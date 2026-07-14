import { useMemo, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import {
  biomarkerDetailRecords,
  defaultBiomarkerDetailId,
} from '@/features/biomarkers/data/biomarkerMockData'

function DetailPanel({ title, description, action, children, className }) {
  return (
    <Card className={cn('!p-0 overflow-hidden', className)}>
      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="text-[1.05rem] font-semibold text-brand-700">{title}</div>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-[var(--app-muted)]">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="border-t border-[var(--app-border)] px-5 py-5">{children}</div>
    </Card>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="join-item flex min-w-0 items-center justify-center border-brand-100 bg-white px-3 py-3 text-center sm:px-4">
      <div>
        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--app-muted)]">{label}</div>
        <div className="mt-1 text-[0.9rem] font-medium text-[var(--app-text)]">{value}</div>
      </div>
    </div>
  )
}

function CopyAction({ copied, onCopy }) {
  return (
    <Button type="button" variant="outline" className="gap-2 px-3 py-2 text-sm" onClick={onCopy}>
      {copied ? (
        <>
          Copied
          <Check className="h-4 w-4" />
        </>
      ) : (
        <>
          Copy
          <Copy className="h-4 w-4" />
        </>
      )}
    </Button>
  )
}

function FieldList({ items }) {
  return (
    <dl className="space-y-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid gap-1 sm:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] sm:items-start sm:gap-4"
        >
          <dt className="text-sm font-semibold text-black">{item.label}</dt>
          <dd className="min-w-0 text-[0.98rem] leading-7 text-[var(--app-text)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function SequenceBlock({ sequence, note }) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl bg-[#faf9f5] p-4">
        <pre className="whitespace-pre-wrap break-all font-mono text-[0.9rem] leading-7 tracking-[0.04em] text-[var(--app-text)]">
          {sequence}
        </pre>
      </div>
      {note ? <p className="text-sm leading-7 text-[var(--app-muted)]">{note}</p> : null}
    </div>
  )
}

function ValueText({ value }) {
  const text = value ?? 'Unavailable'
  const isLink = typeof text === 'string' && text.startsWith('http')
  const isUnavailable = text === 'Unavailable' || text === 'Under Review'

  if (isLink) {
    return (
      <a
        href={text}
        target="_blank"
        rel="noreferrer"
        className="break-all text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-800"
      >
        {text}
      </a>
    )
  }

  return (
    <span className={cn(isUnavailable && 'text-[var(--app-muted)]')}>
      {text}
    </span>
  )
}

export default function BiomarkerDetailPage() {
  const { id } = useParams()
  const [copiedSection, setCopiedSection] = useState('')

  const record = useMemo(() => {
    return (
      biomarkerDetailRecords.find((item) => item.biomarkerId === id) ??
      biomarkerDetailRecords.find((item) => item.biomarkerId === defaultBiomarkerDetailId)
    )
  }, [id])

  const copyToClipboard = async (section, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      window.setTimeout(() => {
        setCopiedSection((current) => (current === section ? '' : current))
      }, 1500)
    } catch {
      setCopiedSection('')
    }
  }

  if (!record) {
    return null
  }

  const generalInformationItems = [
    { label: 'Scientific Name', value: record.topSummaryItems[0]?.value ?? 'Unavailable' },
    { label: 'specimen_id', value: record.topSummaryItems[1]?.value ?? 'Unavailable' },
    { label: 'Province', value: record.topSummaryItems[4]?.value ?? 'Unavailable' },
    {
      label: 'Municipality',
      value:
        record.metadataTab.rows.find((item) => item.label === 'Collection Site (Municipality)')?.value ??
        'Unavailable',
    },
  ]

  const annotationInformationItems = [
    { label: 'gene_marker', value: record.topSummaryItems[2]?.value ?? 'Unavailable' },
    {
      label: 'gene_name',
      value:
        record.topSummaryItems[2]?.value === 'COI'
          ? 'Cytochrome c oxidase subunit I'
          : 'Unavailable',
    },
    {
      label: 'genome_origin',
      value:
        record.topSummaryItems[2]?.value === 'COI'
          ? 'Mitochondrial'
          : 'Unavailable',
    },
    {
      label: 'sequence_completeness',
      value:
        record.sequenceTab.summaryItems?.find((item) => item.label === 'Sequence Completeness')?.value ??
        'Unavailable',
    },
    {
      label: 'sequence_length_bp',
      value: record.topSummaryItems[3]?.value ?? record.sequenceTab.length ?? 'Unavailable',
    },
    {
      label: 'source_method',
      value:
        record.sequenceTab.summaryItems?.find((item) => item.label === 'Source Method')?.value ??
        record.metadataTab.rows.find((item) => item.label === 'Source Method')?.value ??
        'Unavailable',
    },
    { label: 'validation_status', value: record.topSummaryItems[5]?.value ?? record.status },
  ]

  const referenceItems = [
    {
      label: 'sequence_database',
      value:
        record.metadataTab.rows.find((item) => item.label === 'Sequence Database')?.value ?? 'Unavailable',
    },
    {
      label: 'external_accession',
      value: record.overview.fields.find((item) => item.label === 'External Accession')?.value ?? 'Unavailable',
    },
    {
      label: 'publication_doi',
      value: record.overview.fields.find((item) => item.label === 'Publication DOI')?.value ?? 'Unavailable',
    },
  ]

  const generalInformationRows = generalInformationItems.map((item) => ({
    ...item,
    value: <ValueText value={item.value} />,
  }))

  const annotationInformationRows = annotationInformationItems.map((item) => ({
    ...item,
    value: <ValueText value={item.value} />,
  }))

  const referenceRows = referenceItems.map((item) => ({
    ...item,
    value: <ValueText value={item.value} />,
  }))

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Biomarkers', to: '/biomarkers' },
          { label: record.biomarkerId },
        ]}
      />

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-[clamp(1.7rem,3vw,2.6rem)] leading-[0.95] text-black">
              {record.title}
            </h1>
            <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
              {record.status}
            </span>
          </div>
          <p className="text-sm leading-6 text-[var(--app-muted)]">{record.subtitle}</p>
        </div>

        <Button type="button" variant="outline" className="gap-2 self-start px-4">
          Export
          <Download className="h-4 w-4" />
        </Button>
      </section>

      <section className="join join-vertical w-full overflow-hidden rounded-[1.5rem] border border-brand-100 bg-brand-100/60 sm:grid sm:grid-cols-2 sm:gap-px sm:rounded-[1.5rem] xl:grid-cols-6">
          {record.topSummaryItems.map((item) => (
            <SummaryItem key={item.label} label={item.label} value={item.value} />
          ))}
      </section>

      <div className="space-y-6">
        <DetailPanel
          title="General Information"
          description="Core specimen and locality details."
        >
          <FieldList items={generalInformationRows} />
        </DetailPanel>

        <DetailPanel
          title="Annotation Information"
          description="Marker-specific metadata and validation context."
        >
          <FieldList items={annotationInformationRows} />
        </DetailPanel>

        <DetailPanel
          title="Sequence"
          description="Nucleotide sequence with copy action."
          action={
            <CopyAction
              copied={copiedSection === 'nucleotide-sequence'}
              onCopy={() => copyToClipboard('nucleotide-sequence', record.sequenceTab.sequence)}
            />
          }
        >
          <SequenceBlock sequence={record.sequenceTab.sequence} note={record.sequenceTab.translatedNote} />
        </DetailPanel>

        <DetailPanel
          title="References"
          description="External accession and publication linkage."
        >
          <FieldList items={referenceRows} />
        </DetailPanel>
      </div>
    </div>
  )
}
