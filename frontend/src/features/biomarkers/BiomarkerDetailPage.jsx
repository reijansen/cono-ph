import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { loadBiomarkerBackupDetails } from '@/features/biomarkers/data/biomarkerDetailBackupData'

const defaultBiomarkerDetailId = ''

function DetailPanel({ title, description, action, children, className }) {
  return (
    <Card className={cn('!p-0 overflow-hidden', className)}>
      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="text-[1rem] font-semibold text-brand-700">{title}</div>
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
        <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--app-muted)]">{label}</div>
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
    <dl className="space-y-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid gap-1 border-b border-[var(--app-border)]/70 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] sm:items-start sm:gap-4"
        >
          <dt className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">{item.label}</dt>
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
  const [recordsSource, setRecordsSource] = useState([])

  const record = useMemo(() => {
    return (
      recordsSource.find((item) => item.biomarkerId === id) ??
      recordsSource.find((item) => item.biomarkerId === defaultBiomarkerDetailId) ??
      recordsSource[0]
    )
  }, [id, recordsSource])

  const getTopSummaryValue = (label) => {
    return record.topSummaryItems.find((item) => item.label === label)?.value ?? 'Unavailable'
  }

  useEffect(() => {
    let active = true

    async function loadRecords() {
      try {
        const backupRecords = await loadBiomarkerBackupDetails()
        if (active && backupRecords.length > 0) {
          setRecordsSource(backupRecords)
          return
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
    { label: 'Scientific Name', value: getTopSummaryValue('Species Name') },
    { label: 'Specimen ID', value: getTopSummaryValue('Specimen ID') },
    { label: 'Province', value: getTopSummaryValue('Collection Province') },
    {
      label: 'Municipality',
      value:
        record.metadataTab.rows.find((item) => item.label === 'Collection Site (Municipality)')?.value ??
        'Unavailable',
    },
  ]

  const annotationInformationItems = [
    { label: 'Gene Marker', value: getTopSummaryValue('Gene Marker') },
    {
      label: 'Gene Name',
      value:
        getTopSummaryValue('Gene Marker') === 'COI'
          ? 'Cytochrome c oxidase subunit I'
          : 'Unavailable',
    },
    {
      label: 'Genome Origin',
      value:
        getTopSummaryValue('Gene Marker') === 'COI'
          ? 'Mitochondrial'
          : 'Unavailable',
    },
    {
      label: 'Sequence Completeness',
      value:
        record.sequenceTab.summaryItems?.find((item) => item.label === 'Sequence Completeness')?.value ??
        'Unavailable',
    },
    {
      label: 'Sequence Length (bp)',
      value: record.sequenceTab.length ?? 'Unavailable',
    },
    {
      label: 'Source Method',
      value:
        record.sequenceTab.summaryItems?.find((item) => item.label === 'Source Method')?.value ??
        record.metadataTab.rows.find((item) => item.label === 'Source Method')?.value ??
        'Unavailable',
    },
    { label: 'Validation Status', value: getTopSummaryValue('Validation Status') },
  ]

  const referenceItems = [
    {
      label: 'Sequence Database',
      value:
        record.metadataTab.rows.find((item) => item.label === 'Sequence Database')?.value ?? 'Unavailable',
    },
    {
      label: 'External Accession',
      value: record.overview.fields.find((item) => item.label === 'External Accession')?.value ?? 'Unavailable',
    },
    {
      label: 'Publication DOI',
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
