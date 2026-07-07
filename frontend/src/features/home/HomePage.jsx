import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import homeShellImage from '@/assets/HomeShell.png'
import mapImage from '@/assets/map.png'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import HomeShellBackdrop from '@/features/home/components/HomeShellBackdrop'

const dashboardStats = [
  {
    label: 'Species Records',
    value: '7,265',
    className: 'bg-[#f3f4ff] border-0 shadow-none',
  },
  {
    label: 'Conopeptides',
    value: '3,671',
    className: 'bg-[#e8f1ff] border-0 shadow-none',
  },
]

const functionalityItems = [
  {
    number: '01',
    title: 'Species Taxonomy',
    description: 'Classification and species records',
  },
  {
    number: '02',
    title: 'Collection Metadata',
    description: 'Location, specimen, collection info',
  },
  {
    number: '03',
    title: 'Molecular Data',
    description: 'Transcriptomes and conopeptides',
  },
  {
    number: '04',
    title: 'Visualization & Search',
    description: 'Interactive exploration and filtering',
  },
]

function ChartCard() {
  const bars = [
    { label: 'A', height: '58%', color: '#a8c0f2' },
    { label: 'M', height: '100%', color: '#6fe3d7' },
    { label: '01', height: '72%', color: '#111111' },
    { label: '02', height: '96%', color: '#6fb0ff' },
    { label: 'T', height: '46%', color: '#b79be8' },
    { label: 'Unknown', height: '88%', color: '#71d57d' },
  ]

  return (
    <Card className="space-y-4 p-5">
      <h3 className="text-sm font-semibold text-black">Conopeptides by Superfamily</h3>
      <div className="flex h-44 items-end gap-4 pt-4">
        {bars.map((bar) => (
          <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              className="w-full rounded-t-2xl"
              style={{ height: bar.height, backgroundColor: bar.color }}
            />
            <span className="text-[11px] text-[var(--app-muted)]">{bar.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function DonutCard() {
  const segments = [
    ['#212121', 52.1],
    ['#8ab4f8', 22.8],
    ['#a8e6cf', 13.9],
    ['#c7d4f3', 11.2],
  ]

  const gradient = `conic-gradient(${segments
    .map(([color, percent], index, array) => {
      const start = array.slice(0, index).reduce((sum, [, value]) => sum + value, 0)
      const end = start + percent
      return `${color} ${start}% ${end}%`
    })
    .join(', ')})`

  return (
    <Card className="space-y-4 p-5">
      <h3 className="text-sm font-semibold text-black">Specimen Distribution</h3>
      <div className="grid items-center gap-4 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center">
          <div className="relative h-28 w-28 rounded-full" style={{ background: gradient }}>
            <div className="absolute inset-[22%] rounded-full bg-white" />
          </div>
        </div>
        <div className="space-y-2 text-sm text-[var(--app-muted)]">
          {[
            ['Luzon', '52.1%'],
            ['Visayas', '22.8%'],
            ['Mindanao', '13.9%'],
            ['Unknown', '11.2%'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span>{label}</span>
              <span className="text-black">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function LineChartPreview() {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-brand-300">Conopeptide Discoveries Over Time</h3>
        <div className="flex items-center gap-2 text-xs text-[var(--app-muted)]">
          <span className="rounded-full bg-black/5 px-3 py-1">Week</span>
          <span className="rounded-full bg-black/5 px-3 py-1">Sort</span>
          <span className="rounded-full bg-black/5 px-3 py-1">More</span>
        </div>
      </div>
      <svg viewBox="0 0 1200 260" className="h-[220px] w-full">
        <line x1="0" y1="210" x2="1200" y2="210" stroke="#ece8ef" />
        <polyline
          fill="none"
          stroke="#b79cf0"
          strokeWidth="3"
          points="0,160 110,150 180,205 310,180 420,210 520,150 620,160 710,140 790,70 910,80 1010,40 1080,120 1160,105 1200,90"
        />
        {[110, 420, 790, 1010].map((x, index) => (
          <circle key={x} cx={x} cy={[150, 210, 80, 120][index]} r="4" fill="#fff" stroke="#111" />
        ))}
      </svg>
      <div className="flex items-center justify-between text-xs text-[var(--app-muted)]">
        <span>Number of Conopeptides</span>
        <span>Publication Year</span>
      </div>
    </Card>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-14 pb-4 pt-0 sm:pt-0">
      <section className="space-y-6 pt-2 text-center">
        <div className="space-y-4">
          <h1 className="text-[clamp(4rem,10vw,8rem)] leading-[0.95] tracking-tight text-brand-700 sm:text-[clamp(5rem,9vw,9rem)]">
            ConoPH
          </h1>
          <p className="text-[clamp(1.15rem,2vw,2rem)] text-brand-700 sm:leading-none">
            Database for Philippine Cone Snails and Conopeptides
          </p>
        </div>
        <div className="relative mx-auto mt-6 h-[250px] max-w-[1120px] overflow-visible sm:mt-8 sm:h-[300px] md:h-[330px]">
          <HomeShellBackdrop />
          <img
            src={homeShellImage}
            alt="ConoPH hero shell"
            className="absolute bottom-0 left-1/2 z-10 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain"
          />
        </div>
      </section>

      <section className="space-y-5 border-t border-brand-100 pt-8">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-brand-500">
            Stats Dashboard Preview
          </p>
          <h2 className="mt-3 text-[clamp(2.2rem,4vw,3.5rem)] leading-none text-black">
            Visualize Philippine Cone Snail Biodiversity
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--app-muted)] sm:text-base">
            Explore species distribution, peptide diversity, and transcriptomic insights through
            static preview panels aligned with the client layout.
          </p>
          <div className="mt-6">
            <Button as={Link} to="/visualization" variant="primary" size="md" className="px-8">
              Discover More
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden p-0">
            <img
              src={mapImage}
              alt="Philippine map preview"
              className="h-full w-full object-cover"
            />
          </Card>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {dashboardStats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  className={stat.className}
                />
              ))}
            </div>
            <ChartCard />
            <DonutCard />
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-brand-100 pt-8">
        <LineChartPreview />
      </section>

      <section className="space-y-8 border-t border-brand-100 pt-10">
        <h2 className="text-[clamp(2.4rem,4vw,3.6rem)] leading-none text-black">
          Core Functionalities
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {functionalityItems.map((item) => (
            <div key={item.number} className="space-y-6 border-t border-black/10 pt-4">
              <div className="text-5xl font-light text-black/35">{item.number}</div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-black">{item.title}</h3>
                <p className="text-sm leading-6 text-[var(--app-muted)]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="space-y-6 border-t border-brand-100 py-12 text-center">
        <h2 className="text-[clamp(2.4rem,4vw,3.6rem)] leading-none text-black">
          Connect with us
        </h2>
        <p className="mx-auto max-w-3xl text-sm leading-7 text-[var(--app-muted)] sm:text-base">
          Learn more about ConoPH and how it supports Philippine cone snail research and
          biodiversity data integration.
        </p>
        <div className="pt-2">
          <Button as={Link} to="/about" variant="primary" size="lg" className="min-w-[260px]">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
