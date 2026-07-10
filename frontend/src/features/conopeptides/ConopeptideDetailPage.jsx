import { useMemo, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import {
  conopeptideDetailRecords,
  defaultConopeptideDetailId,
} from '@/features/conopeptides/data/conopeptideMockData'

function DetailPanel({ title, action, children, className }) {
  return (
    <Card className={cn('!p-0 overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="text-[1.05rem] font-semibold text-brand-700">{title}</div>
        {action}
      </div>
      <div className="border-t border-[var(--app-border)] px-5 py-5">{children}</div>
    </Card>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="min-w-0 border-r border-[var(--app-border)] px-5 py-2 last:border-r-0">
      <div className="text-[0.82rem] text-[var(--app-muted)]">{label}</div>
      <div className="mt-2 text-[1rem] font-medium text-[var(--app-text)]">{value}</div>
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

function SequenceFieldCard({ label, value, onCopy, multiline = false }) {
  const isLongValue = String(value).length > 42
  const displayValue = multiline ? value : isLongValue ? `${String(value).slice(0, 42)}...` : value

  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[var(--app-muted)]">{label}</p>
          <p
            className={cn(
              'mt-2 text-[1rem] font-medium text-[var(--app-text)]',
              multiline ? 'whitespace-normal break-all leading-6' : 'overflow-hidden text-ellipsis break-words',
            )}
            title={String(value)}
          >
            {displayValue}
          </p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--app-border)] bg-white text-[var(--app-muted)] transition hover:border-brand-300 hover:text-brand-700"
          aria-label={`Copy ${label}`}
          title={`Copy ${label}`}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function SequenceBlock({ sequence, note }) {
  const sequenceText = Array.isArray(sequence) ? sequence.join('\n') : sequence

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white p-4">
        <div className="grid grid-cols-[22px_minmax(0,1fr)] gap-3 text-[0.82rem] text-[var(--app-muted)]">
          <span>1</span>
          <pre className="min-w-0 whitespace-pre-wrap break-all font-mono text-[0.95rem] leading-8 tracking-[0.08em] text-[var(--app-text)]">
            {sequenceText}
          </pre>
        </div>
      </div>
      {note ? <p className="text-sm leading-7 text-[var(--app-muted)]">{note}</p> : null}
    </div>
  )
}

export default function ConopeptideDetailPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  const [copiedSection, setCopiedSection] = useState('')

  const record = useMemo(() => {
    return (
      conopeptideDetailRecords.find((item) => item.accession === id) ??
      conopeptideDetailRecords.find((item) => item.accession === defaultConopeptideDetailId)
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

  const sequencesTab = record.sequencesTab
  const annotationsTab = record.annotationsTab
  const sourceTab = record.sourceTab

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Conopeptides', to: '/conopeptides' },
          { label: record.accession },
        ]}
      />

      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-[clamp(2.6rem,4.6vw,4.75rem)] leading-[0.95] text-black">
              {record.title}
            </h1>
            <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
              {record.status}
            </span>
          </div>
          <p className="text-[1.05rem] text-[var(--app-muted)]">{record.subtitle}</p>
        </div>

        <Button type="button" variant="outline" className="gap-2 self-start px-4">
          Export
          <Download className="h-4 w-4" />
        </Button>
      </section>

      <Card className="!p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-6">
          {record.topSummaryItems.map((item) => (
            <SummaryItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </Card>

      <section className="border-b border-[var(--app-border)]">
        <div className="flex flex-wrap gap-6 sm:gap-10">
          {record.tabs.map((tab) => {
            const isActive = tab === activeTab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'border-b-2 border-transparent pb-4 text-[1rem] font-medium transition',
                  isActive
                    ? 'border-brand-500 text-brand-700'
                    : 'text-[var(--app-muted)] hover:text-brand-700',
                )}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </section>

      {activeTab === 'Overview' ? (
        <div className="space-y-6">
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.75fr)]">
            <DetailPanel
              title="Predicted Peptide"
              action={
                <CopyAction
                  copied={copiedSection === 'predicted-peptide'}
                  onCopy={() => copyToClipboard('predicted-peptide', record.predictedPeptide)}
                />
              }
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-[1.95rem] tracking-[0.38em] text-[var(--app-text)] sm:text-[2.2rem]">
                  {record.predictedPeptide.split('').map((letter, index) => (
                    <span key={`${letter}-${index}`} className="inline-flex flex-col items-center">
                      <span className="font-mono">{letter}</span>
                      <span className="mt-2 text-sm tracking-normal text-brand-700">
                        {record.predictedPeptideMarkers.includes(String(index + 1))
                          ? String(index + 1)
                          : '\u00A0'}
                      </span>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--app-muted)]">
                  <span className="h-3 w-3 rounded-full bg-brand-400" />
                  {record.predictedPeptideLegend}
                </div>
              </div>
            </DetailPanel>

            <DetailPanel title="About">
              <p className="text-[1.02rem] leading-7 text-brand-700">{record.about}</p>
            </DetailPanel>
          </section>

          <DetailPanel title="Matched Toxin">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[1.55rem] font-semibold text-[var(--app-text)]">
                    {record.matchedToxin.name}
                  </h3>
                  <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                    {record.matchedToxin.tag}
                  </span>
                </div>
                <p className="max-w-2xl text-[1rem] leading-7 text-[var(--app-muted)]">
                  {record.matchedToxin.summary}
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="rounded-2xl border border-[var(--app-border)] bg-white p-4">
                  <p className="text-sm text-[var(--app-muted)]">Reference</p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[var(--app-text)]">
                    {record.matchedToxin.reference}
                  </p>
                </div>

                <Button type="button" variant="outline" className="gap-2 px-4">
                  {record.matchedToxin.referenceAction}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DetailPanel>

          <section className="grid gap-4">
            <DetailPanel
              title="Precursor Sequence"
              action={
                <CopyAction
                  copied={copiedSection === 'precursor-sequence'}
                  onCopy={() =>
                    copyToClipboard('precursor-sequence', sequencesTab.precursorSequence.join('\n'))
                  }
                />
              }
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-stretch">
                <SequenceBlock sequence={sequencesTab.precursorSequence} />

                <div className="space-y-4 rounded-2xl border border-[var(--app-border)] bg-white p-5">
                  <div>
                    <p className="text-[1rem] text-[var(--app-muted)]">Length</p>
                    <p className="mt-2 text-[1.1rem] font-semibold text-brand-700">
                      {record.precursorMetadata.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-[1rem] text-[var(--app-muted)]">Translation</p>
                    <p className="mt-2 text-[1.1rem] font-semibold text-brand-700">
                      {record.precursorMetadata.translation}
                    </p>
                  </div>
                </div>
              </div>
            </DetailPanel>
          </section>

          <DetailPanel
            title="Translated Precursor (with predicted mature peptide highlighted)"
            action={
              <CopyAction
                copied={copiedSection === 'translated-precursor'}
                onCopy={() =>
                  copyToClipboard(
                    'translated-precursor',
                    sequencesTab.translatedPrecursorSegments.map((segment) => segment.text).join(''),
                  )
                }
              />
            }
          >
            <div className="rounded-2xl border border-[var(--app-border)] bg-brand-50/20 p-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[1rem] tracking-[0.38em] text-[var(--app-text)]">
                {sequencesTab.translatedPrecursorSegments.map((segment, index) => (
                  <span
                    key={`${segment.text}-${index}`}
                    className={cn(
                      'rounded-md px-1 py-1',
                      segment.highlighted && 'bg-brand-100 text-brand-700',
                    )}
                  >
                    {segment.text}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-[var(--app-muted)]">
                <span className="h-3 w-3 rounded-sm bg-brand-300" />
                Mature peptide
              </div>
            </div>
          </DetailPanel>

          <DetailPanel title="Additional Information">
            <div className="grid gap-6 lg:grid-cols-2">
              {record.additionalInformation.map((item) => (
                <div key={item.label} className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">
                  <dt className="font-semibold text-brand-700">{item.label}</dt>
                  <dd className="text-[var(--app-text)]">{item.value}</dd>
                </div>
              ))}
            </div>
          </DetailPanel>
        </div>
      ) : activeTab === 'Sequences' ? (
        <div className="space-y-6">
          <DetailPanel title="Sequence Information">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sequencesTab.fields.map((item) => (
                <SequenceFieldCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  multiline={
                    [
                      'Precursor Sequence',
                      'Remarks for Sequence',
                      'Signal peptide',
                      'Propeptide sequence',
                      'Mature Peptide Sequence',
                      'Post Peptide Sequence',
                    ].includes(item.label)
                  }
                  onCopy={() => copyToClipboard(`sequence-field-${item.label}`, item.value)}
                />
              ))}
            </div>
          </DetailPanel>

          <DetailPanel
            title="Predicted Peptide"
            action={
              <CopyAction
                copied={copiedSection === 'sequence-predicted'}
                onCopy={() => copyToClipboard('sequence-predicted', sequencesTab.predictedPeptide)}
              />
            }
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-[1.95rem] tracking-[0.38em] text-[var(--app-text)] sm:text-[2.2rem]">
                {sequencesTab.predictedPeptide.split('').map((letter, index) => (
                  <span key={`${letter}-${index}`} className="inline-flex flex-col items-center">
                    <span className="font-mono">{letter}</span>
                    <span className="mt-2 text-sm tracking-normal text-brand-700">
                      {sequencesTab.predictedPeptideMarkers.includes(String(index + 1))
                        ? String(index + 1)
                        : '\u00A0'}
                    </span>
                  </span>
                ))}
              </div>
              <p className="text-sm leading-7 text-[var(--app-muted)]">{sequencesTab.predictedPeptideNote}</p>
            </div>
          </DetailPanel>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <DetailPanel
              title="Precursor Nucleotide Sequence"
              action={
                <CopyAction
                  copied={copiedSection === 'sequence-precursor'}
                  onCopy={() => copyToClipboard('sequence-precursor', sequencesTab.precursorSequence.join('\n'))}
                />
              }
            >
              <SequenceBlock
                sequence={sequencesTab.precursorSequence}
                note={sequencesTab.precursorSequenceNote}
              />
            </DetailPanel>

            <div className="space-y-4 rounded-3xl border border-[var(--app-border)] bg-white p-5">
              <div>
                <p className="text-[1rem] text-[var(--app-muted)]">Length</p>
                <p className="mt-2 text-[1.1rem] font-semibold text-brand-700">
                  {record.precursorMetadata.length}
                </p>
              </div>
              <div>
                <p className="text-[1rem] text-[var(--app-muted)]">Translation</p>
                <p className="mt-2 text-[1.1rem] font-semibold text-brand-700">
                  {record.precursorMetadata.translation}
                </p>
              </div>
            </div>
          </section>

          <DetailPanel
            title="Translated Amino Acid Sequence"
            action={
              <CopyAction
                copied={copiedSection === 'sequence-translated'}
                onCopy={() =>
                  copyToClipboard(
                    'sequence-translated',
                    sequencesTab.translatedPrecursorSegments.map((segment) => segment.text).join(''),
                  )
                }
              />
            }
          >
            <div className="rounded-2xl border border-[var(--app-border)] bg-brand-50/20 p-4">
              <div className="font-mono text-[1rem] leading-8 tracking-[0.28em] text-[var(--app-text)] whitespace-pre-wrap break-words">
                {sequencesTab.translatedPrecursorSegments.map((segment, index) => (
                  <span
                    key={`${segment.text}-${index}`}
                    className={cn(
                      'rounded-md px-1 py-1 align-middle',
                      segment.highlighted && 'bg-brand-100 text-brand-700',
                    )}
                  >
                    {segment.text}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-[var(--app-muted)]">
                <span className="h-3 w-3 rounded-sm bg-brand-300" />
                {sequencesTab.translatedPrecursorNote}
              </div>
            </div>
          </DetailPanel>
        </div>
      ) : activeTab === 'Annotations' ? (
        <div className="space-y-6">
          <DetailPanel title="Annotation Summary">
            <div className="space-y-4">
              <p className="max-w-3xl text-[1rem] leading-7 text-[var(--app-muted)]">{annotationsTab.summary}</p>
              <div className="grid gap-4 lg:grid-cols-2">
                {annotationsTab.items.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[var(--app-border)] bg-white p-4">
                    <p className="text-sm text-[var(--app-muted)]">{item.label}</p>
                    <p className="mt-2 text-[1rem] font-medium text-[var(--app-text)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </DetailPanel>

          <DetailPanel title="Matched Toxin / Functional Note">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[1.55rem] font-semibold text-[var(--app-text)]">
                    {record.matchedToxin.name}
                  </h3>
                  <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                    {record.matchedToxin.tag}
                  </span>
                </div>
                <p className="max-w-2xl text-[1rem] leading-7 text-[var(--app-muted)]">
                  {record.matchedToxin.summary}
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="rounded-2xl border border-[var(--app-border)] bg-white p-4">
                  <p className="text-sm text-[var(--app-muted)]">Evidence Note</p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[var(--app-text)]">
                    {annotationsTab.summary}
                  </p>
                </div>

                <Button type="button" variant="outline" className="gap-2 px-4">
                  {record.matchedToxin.referenceAction}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DetailPanel>
        </div>
      ) : (
        <div className="space-y-6">
          <DetailPanel title="Record Source">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
              <dl className="grid gap-5 sm:grid-cols-2">
                {sourceTab.rows.map((item) => (
                  <div key={item.label} className="grid gap-2">
                    <dt className="text-sm text-[var(--app-muted)]">{item.label}</dt>
                    <dd className="font-medium text-[var(--app-text)]">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="space-y-4 rounded-2xl border border-[var(--app-border)] bg-white p-5">
                <div>
                  <p className="text-sm text-[var(--app-muted)]">Citation</p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[var(--app-text)]">
                    {sourceTab.citation}
                  </p>
                </div>
                <Button type="button" variant="outline" className="gap-2 px-4">
                  View in Reference
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DetailPanel>
        </div>
      )}
    </div>
  )
}
