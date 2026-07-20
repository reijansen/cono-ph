import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { fetchConopeptideDetail } from '@/services/catalogService'
import { loadConopeptideBackupDetails } from '@/features/conopeptides/data/conopeptideDetailBackupData'

const defaultConopeptideDetailId = ''

function DetailPanel({ title, children, className }) {
  return (
    <Card className={cn('!p-0 overflow-hidden', className)}>
      <div className="px-5 py-4">
        <div className="text-[1rem] font-semibold text-brand-700">{title}</div>
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

function CopyIconButton({ copied, onCopy, label, className }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--app-border)] bg-white text-[var(--app-muted)] transition hover:border-brand-300 hover:text-brand-700',
        className,
      )}
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
    >
      {copied ? <Check className="h-4 w-4 text-brand-700" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}

function ValueText({ value, italic = false }) {
  const text = value ?? 'Unavailable'
  const isLink = typeof text === 'string' && text.startsWith('http')

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

  return <span className={cn(italic && 'italic')}>{text}</span>
}

function FieldList({ items, copiedField, onCopy }) {
  return (
    <dl className="space-y-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid gap-2 border-b border-[var(--app-border)]/70 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] sm:items-start sm:gap-4"
        >
          <dt className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">
            {item.label}
          </dt>
          <dd className="min-w-0 text-[0.98rem] leading-7 text-[var(--app-text)]">
            {item.copyValue ? (
              <div className="flex items-start gap-3">
                <span className="min-w-0 flex-1 break-all">{item.value}</span>
                <CopyIconButton
                  className="ml-auto"
                  copied={copiedField === item.label}
                  onCopy={() => onCopy(item.label, item.copyValue)}
                  label={item.label}
                />
              </div>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ArchitectureGrid({ items, copiedField, onCopy }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1.25rem] border border-[var(--app-border)] bg-[#fcfcf8] p-4">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">
            {item.label}
          </p>
          <div className="mt-3 flex items-start gap-3">
            <p className="min-w-0 flex-1 break-all font-mono text-[0.98rem] text-[var(--app-text)]">{item.value}</p>
            <CopyIconButton
              className="ml-auto"
              copied={copiedField === item.label}
              onCopy={() => onCopy(item.label, item.value)}
              label={item.label}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ConopeptideDetailPage() {
  const { id } = useParams()
  const [copiedField, setCopiedField] = useState('')
  const [recordsSource, setRecordsSource] = useState([])

  const record = useMemo(() => {
    return (
      recordsSource.find((item) => item.accession === id) ??
      recordsSource.find((item) => item.accession === defaultConopeptideDetailId) ??
      recordsSource[0]
    )
  }, [id, recordsSource])

  useEffect(() => {
    let active = true

    async function loadRecords() {
      try {
        const liveRecord = await fetchConopeptideDetail(id)
        if (active && liveRecord) {
          setRecordsSource([liveRecord])
          return
        }

        const backupRecords = await loadConopeptideBackupDetails()
        if (active && backupRecords.length > 0) {
          setRecordsSource(backupRecords)
          return
        }
      } catch {
        try {
          const backupRecords = await loadConopeptideBackupDetails()
          if (active && backupRecords.length > 0) {
            setRecordsSource(backupRecords)
          } else if (active) {
            setRecordsSource([])
          }
        } catch {
          if (active) {
            setRecordsSource([])
          }
        }
      }
    }

    loadRecords()

    return () => {
      active = false
    }
  }, [])

  const copyToClipboard = async (field, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      window.setTimeout(() => {
        setCopiedField((current) => (current === field ? '' : current))
      }, 1500)
    } catch {
      setCopiedField('')
    }
  }

  if (!record) {
    return null
  }

  const generalInformationRows = [
    { label: 'Conopeptide ID', value: <ValueText value={record.generalInformation.conopeptideId} /> },
    { label: 'Species', value: <ValueText value={record.generalInformation.species} italic /> },
    { label: 'Species ID', value: <ValueText value={record.generalInformation.speciesId} /> },
    { label: 'Sequence remarks', value: <ValueText value={record.generalInformation.sequenceRemarks} /> },
  ]

  const sequenceInformationRows = [
    {
      label: 'Precursor sequence',
      value: record.sequenceInformation.precursorSequence,
      copyValue: record.sequenceInformation.precursorSequence,
    },
    { label: 'Precursor length', value: <ValueText value={record.sequenceInformation.precursorLength} /> },
  ]

  const classificationRows = [
    { label: 'Gene superfamily', value: <ValueText value={record.classification.geneSuperfamily} /> },
    { label: 'Mature peptide length', value: <ValueText value={record.classification.maturePeptideLength} /> },
    { label: 'Number of cysteines', value: <ValueText value={record.classification.numberOfCysteines} /> },
    { label: 'Cysteine pattern', value: <ValueText value={record.classification.cysteinePattern} /> },
    { label: 'Cysteine framework', value: <ValueText value={record.classification.cysteineFramework} /> },
  ]

  const similarityRows = [
    { label: 'Matched toxin', value: <ValueText value={record.similarity.matchedToxin} /> },
    { label: 'Percent similarity', value: <ValueText value={record.similarity.percentSimilarity} /> },
    { label: 'Similarity source', value: <ValueText value={record.similarity.similaritySource} /> },
  ]

  const expressionRows = [
    { label: 'Expression value', value: <ValueText value={record.expression.expressionValue} /> },
  ]

  const referenceRows = [{ label: 'DOI', value: <ValueText value={record.reference.doi} /> }]

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Conopeptides', to: '/conopeptides' },
          { label: record.accession },
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
        <DetailPanel title="General Information">
          <FieldList items={generalInformationRows} copiedField={copiedField} onCopy={copyToClipboard} />
        </DetailPanel>

        <DetailPanel title="Sequence Information">
          <FieldList items={sequenceInformationRows} copiedField={copiedField} onCopy={copyToClipboard} />
        </DetailPanel>

        <DetailPanel title="Sequence Architecture">
          <ArchitectureGrid
            items={record.sequenceArchitecture}
            copiedField={copiedField}
            onCopy={copyToClipboard}
          />
        </DetailPanel>

        <DetailPanel title="Classification and Characterization">
          <FieldList items={classificationRows} copiedField={copiedField} onCopy={copyToClipboard} />
        </DetailPanel>

        <DetailPanel title="Similarity Information">
          <FieldList items={similarityRows} copiedField={copiedField} onCopy={copyToClipboard} />
        </DetailPanel>

        <DetailPanel title="Expression Information">
          <FieldList items={expressionRows} copiedField={copiedField} onCopy={copyToClipboard} />
        </DetailPanel>

        <DetailPanel title="Reference">
          <FieldList items={referenceRows} copiedField={copiedField} onCopy={copyToClipboard} />
        </DetailPanel>
      </div>
    </div>
  )
}
