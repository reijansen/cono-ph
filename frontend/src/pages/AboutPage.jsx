import { Database, Rocket, Search } from 'lucide-react'

import homeShellImage from '@/assets/HomeShell.png'
import msiLogo from '@/assets/msi-logo.png'
import pgcLogo from '@/assets/pgc-logo.png'
import Card from '@/components/ui/Card'
import { cn } from '@/utils/cn'

const institutionItems = [
  {
    logo: pgcLogo,
    name: 'Philippine Genome Center',
    affiliation: 'UP System',
  },
  {
    logo: msiLogo,
    name: 'Marine Science Institute',
    affiliation: 'UP Diliman',
  },
]

const featureItems = [
  {
    icon: Database,
    title: 'Centralized Data',
    description:
      'Organizes and standardizes species, specimen, and conopeptide data in one accessible repository.',
  },
  {
    icon: Search,
    title: 'Research Support',
    description:
      'Facilitates data discovery, cross-referencing, and visualization for biodiversity and biomedical research.',
  },
  {
    icon: Rocket,
    title: 'Future Expansion',
    description:
      'Built as a foundation for a national repository of Philippine cone snails and conopeptides resources.',
  },
]

const developerItems = [
  {
    name: 'Bianca Germaine Manatad',
    role: 'Data Modeller',
    contribution: 'Data modelling, metadata organization, and record structuring.',
    initials: 'BG',
    avatarClass: 'bg-brand-50',
  },
  {
    name: 'Timothy James Guela',
    role: 'Backend Developer',
    contribution: 'Database logic, integration scaffolding, and API-ready data structures.',
    initials: 'TJ',
    avatarClass: 'bg-brand-100',
  },
  {
    name: 'Rei Jansen Buerom',
    role: 'UI/UX and Frontend Developer',
    contribution: 'Interface composition, layout implementation, and responsive styling.',
    initials: 'RJ',
    avatarClass: 'bg-brand-200',
  },
  {
    name: 'Lamberto Fonseca Jr.',
    role: 'Tech Mentor',
    contribution: 'Project direction, technical review, and implementation guidance.',
    initials: 'LF',
    avatarClass: 'bg-brand-100',
  },
  {
    name: 'Dan Jethro Masacupan',
    role: 'Bioinformatics Mentor',
    contribution: 'Bioinformatics review, research guidance, and analytical oversight.',
    initials: 'DJ',
    avatarClass: 'bg-brand-50',
  },
  {
    name: 'Gliezel Ann Pajarilla',
    role: 'Tech Mentor',
    contribution: 'Technical validation, UI feedback, and project support.',
    initials: 'GA',
    avatarClass: 'bg-brand-100',
  },
]

function SectionTitle({ title, className }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <h2 className="text-[clamp(2rem,3vw,3rem)] leading-none text-black">{title}</h2>
      <span className="h-px flex-1 bg-brand-700/60" />
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="h-full border-brand-200 p-4 sm:p-5">
      <div className="flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ecebe8] text-brand-700">
          <Icon className="h-7 w-7" strokeWidth={1.8} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg leading-tight text-brand-700">{title}</h3>
          <p className="text-sm leading-6 text-[var(--app-muted)]">{description}</p>
        </div>
      </div>
    </Card>
  )
}

function InstitutionLogoItem({ logo, name, affiliation }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-100 bg-white shadow-sm sm:h-28 sm:w-28">
        <img src={logo} alt={`${name} logo`} className="h-full w-full object-contain p-3" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg leading-tight text-[var(--app-text)] sm:text-xl">{name}</h3>
        <p className="text-sm leading-6 text-[var(--app-muted)]">{affiliation}</p>
      </div>
    </div>
  )
}

function AvatarPlaceholder({ initials, avatarClass }) {
  return (
    <div
      className={cn(
        'flex h-28 w-28 items-center justify-center rounded-full border border-brand-100 text-lg font-semibold tracking-[0.2em] text-[var(--app-text)] shadow-sm',
        avatarClass,
      )}
    >
      {initials}
    </div>
  )
}

function DeveloperCard({ name, role, contribution, initials, avatarClass }) {
  return (
    <Card className="flex h-full min-h-[335px] flex-col items-center justify-start p-6 text-center">
      <AvatarPlaceholder initials={initials} avatarClass={avatarClass} />

      <div className="mt-6 space-y-2">
        <h3 className="text-[1.03rem] font-semibold uppercase leading-6 tracking-wide text-black">
          {name}
        </h3>
        <p className="text-[1rem] italic leading-6 text-brand-700">{role}</p>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-sm font-medium tracking-wide text-[var(--app-muted)]">Contribution</p>
        <p className="text-sm leading-6 text-[var(--app-muted)]">{contribution}</p>
      </div>
    </Card>
  )
}

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-6 sm:space-y-20">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
        <div className="space-y-5">
          <div className="space-y-3">
            <h1 className="font-serif text-[clamp(3.1rem,5vw,5.4rem)] leading-[0.95] tracking-tight text-black">
              About ConoPH
            </h1>
            <p className="text-[clamp(1.1rem,1.7vw,1.45rem)] font-medium text-brand-700">
              Philippine Cone Snail and Conopeptide Database
            </p>
          </div>

          <div className="space-y-5 text-sm leading-7 text-[var(--app-muted)] sm:text-base">
            <p>
              ConoPH is a proof-of-concept database developed to centralize and integrate Philippine
              cone snail biodiversity and conopeptide data. It brings together species taxonomy,
              specimen metadata, transcriptomic annotations, and molecular sequence information into
              a unified platform.
            </p>
            <p>
              The database is designed to support research, biodiversity conservation, and drug
              discovery by making curated Philippine marine biodiversity information more accessible
              to researchers and collaborators.
            </p>
            <p>
              As the project evolves, ConoPH is intended to serve as a centralized resource for
              Philippine cone snail records and related molecular data.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-brand-50/40 p-4 shadow-sm sm:p-5">
          <div className="overflow-hidden rounded-[1.75rem] bg-white p-4 sm:p-6">
            <img
              src={homeShellImage}
              alt="Cone snail shell illustration"
              className="mx-auto h-auto w-full max-w-[720px] object-contain drop-shadow-[0_18px_35px_rgba(108,127,34,0.16)]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle title="Collaborating Institutions" />
        <div className="flex flex-col items-center justify-center gap-8 py-4 md:flex-row md:gap-12 lg:gap-16">
          {institutionItems.map((institution) => (
            <InstitutionLogoItem key={institution.name} {...institution} />
          ))}
        </div>
      </section>

      <section className="space-y-7">
        <div className="space-y-3 text-center">
          <h2 className="text-[clamp(2rem,3vw,3rem)] leading-none text-brand-700">
            What ConoPH Enables
          </h2>
          <span className="mx-auto block h-px w-20 bg-brand-700/60" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureItems.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="space-y-7">
        <div className="space-y-3">
          <SectionTitle title="The Developers" />
          <p className="max-w-4xl text-sm leading-7 text-[var(--app-muted)] sm:text-base">
            A team of students and researchers dedicated to building open scientific resources for
            the Philippine marine biodiversity community.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {developerItems.map((developer) => (
            <DeveloperCard key={developer.name} {...developer} />
          ))}
        </div>
      </section>
    </div>
  )
}
