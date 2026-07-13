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

function FieldGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-[var(--app-border)] bg-white p-4">
          <p className="text-sm text-[var(--app-muted)]">{item.label}</p>
          <p className="mt-2 text-[1rem] font-medium leading-7 text-[var(--app-text)]">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function SequenceBlock({ sequence, note }) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-white p-4">
        <pre className="whitespace-pre-wrap break-all font-mono text-[0.95rem] leading-8 tracking-[0.08em] text-[var(--app-text)]">
          {sequence}
        </pre>
      </div>
      {note ? <p className="text-sm leading-7 text-[var(--app-muted)]">{note}</p> : null}
    </div>
  )
}

function MetadataGrid({ items }) {
  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="grid gap-2">
          <dt className="text-sm text-[var(--app-muted)]">{item.label}</dt>
          <dd className="font-medium leading-7 text-[var(--app-text)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function BiomarkerDetailPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
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

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Biomarkers', to: '/biomarkers' },
          { label: record.biomarkerId },
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
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <DetailPanel title="Record Summary">
              <div className="space-y-5">
                <FieldGrid items={record.overview.fields} />
                <p className="text-[1rem] leading-7 text-[var(--app-muted)]">{record.overview.description}</p>
              </div>
            </DetailPanel>

            <DetailPanel title="Overview Note">
              <p className="text-[1.02rem] leading-7 text-brand-700">{record.overview.note}</p>
            </DetailPanel>
          </section>

          <DetailPanel title={record.overview.reference.title}>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="rounded-2xl border border-[var(--app-border)] bg-white p-4">
                <p className="text-sm text-[var(--app-muted)]">Citation</p>
                <p className="mt-2 text-[0.98rem] leading-7 text-[var(--app-text)]">
                  {record.overview.reference.citation}
                </p>
              </div>

              <Button type="button" variant="outline" className="gap-2 px-4">
                {record.overview.reference.actionLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </DetailPanel>
        </div>
      ) : activeTab === 'Sequence' ? (
        <div className="space-y-6">
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <DetailPanel
              title="Nucleotide Sequence"
              action={
                <CopyAction
                  copied={copiedSection === 'nucleotide-sequence'}
                  onCopy={() => copyToClipboard('nucleotide-sequence', record.sequenceTab.sequence)}
                />
              }
            >
              <SequenceBlock sequence={record.sequenceTab.sequence} />
            </DetailPanel>

            <div className="space-y-4 rounded-3xl border border-[var(--app-border)] bg-white p-5">
              {record.sequenceTab.summaryItems?.map((item) => (
                <div key={item.label}>
                  <p className="text-[1rem] text-[var(--app-muted)]">{item.label}</p>
                  <p className="mt-2 text-[1.1rem] font-semibold text-brand-700">{item.value}</p>
                </div>
              )) || (
                <div>
                  <p className="text-[1rem] text-[var(--app-muted)]">Sequence Length</p>
                  <p className="mt-2 text-[1.1rem] font-semibold text-brand-700">
                    {record.sequenceTab.length}
                  </p>
                </div>
              )}
            </div>
          </section>

          <DetailPanel
            title="Translated Preview"
            action={
              <CopyAction
                copied={copiedSection === 'translated-preview'}
                onCopy={() => copyToClipboard('translated-preview', record.sequenceTab.translated)}
              />
            }
          >
            <SequenceBlock sequence={record.sequenceTab.translated} note={record.sequenceTab.translatedNote} />
          </DetailPanel>
        </div>
      ) : activeTab === 'Annotations' ? (
        <div className="space-y-6">
          <DetailPanel title="Annotation Summary">
            <div className="space-y-4">
              <p className="max-w-3xl text-[1rem] leading-7 text-[var(--app-muted)]">
                {record.annotationsTab.summary}
              </p>
              <div className="grid gap-4 lg:grid-cols-2">
                {record.annotationsTab.items.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[var(--app-border)] bg-white p-4">
                    <p className="text-sm text-[var(--app-muted)]">{item.label}</p>
                    <p className="mt-2 text-[1rem] font-medium leading-7 text-[var(--app-text)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DetailPanel>

          {record.annotationsTab.reference ? (
            <DetailPanel title="Annotation Reference">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="rounded-2xl border border-[var(--app-border)] bg-white p-4">
                  <p className="text-sm text-[var(--app-muted)]">{record.annotationsTab.reference.label}</p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[var(--app-text)]">
                    {record.annotationsTab.reference.value}
                  </p>
                </div>

                <Button type="button" variant="outline" className="gap-2 px-4">
                  {record.annotationsTab.reference.actionLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </DetailPanel>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          <DetailPanel title="Record Metadata">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
              <MetadataGrid items={record.metadataTab.rows} />

              <div className="space-y-4 rounded-2xl border border-[var(--app-border)] bg-white p-5">
                <div>
                  <p className="text-sm text-[var(--app-muted)]">Citation</p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[var(--app-text)]">
                    {record.metadataTab.citation}
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
