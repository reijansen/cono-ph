import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import homeShellImage from '@/assets/HomeShell.png'
import Button from '@/components/ui/Button'
import HomeShellBackdrop from '@/features/home/components/HomeShellBackdrop'
import HomeDashboardSection from '@/features/home/components/HomeDashboardSection'

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

export default function HomePage() {
  return (
    <div className="space-y-10 pb-4 pt-0 sm:space-y-12 sm:pt-0">
      <section className="mx-auto w-full max-w-[1600px] space-y-4 pt-2 text-center sm:space-y-5">
        <div className="space-y-4">
          <h1 className="text-[clamp(3.45rem,8vw,6.8rem)] leading-[0.92] tracking-tight text-brand-700 sm:text-[clamp(4.4rem,8vw,7.4rem)]">
            ConoPH
          </h1>
          <p className="mx-auto max-w-3xl text-[clamp(1rem,1.7vw,1.4rem)] leading-6 text-brand-700 sm:leading-7">
            Database for Philippine Cone Snails and Conopeptides
          </p>
          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
            <Button as={Link} to="/visualization" variant="primary" size="lg">
              Explore visualizations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button as={Link} to="/species" variant="outline" size="lg">
              Browse species
            </Button>
          </div>
        </div>
        <div className="relative mt-4 h-[210px] w-full overflow-visible sm:mt-8 sm:h-[300px] md:h-[330px] xl:h-[370px]">
          <HomeShellBackdrop />
          <img
            src={homeShellImage}
            alt="ConoPH hero shell"
            className="absolute bottom-0 left-1/2 z-10 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain xl:h-[98%]"
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1600px]">
        <HomeDashboardSection />
      </div>

      <section className="mx-auto w-full max-w-[1600px] space-y-6 border-t border-brand-100 pt-8 sm:space-y-7 sm:pt-10">
        <h2 className="text-[clamp(2rem,3.4vw,3rem)] leading-none text-black">
          Core Functionalities
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {functionalityItems.map((item) => (
            <div key={item.number} className="space-y-4 border-t border-black/10 pt-4">
              <div className="text-3xl font-light text-black/35 sm:text-4xl">{item.number}</div>
              <div className="space-y-2">
                <h3 className="text-[0.92rem] font-semibold text-black">{item.title}</h3>
                <p className="text-[0.92rem] leading-6 text-[var(--app-muted)]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-[1600px] space-y-6 border-t border-brand-100 py-12 text-center">
        <h2 className="text-[clamp(2rem,3.4vw,3rem)] leading-none text-black">
          Connect with us
        </h2>
        <p className="mx-auto max-w-3xl text-sm leading-7 text-[var(--app-muted)] sm:text-base">
          Learn more about ConoPH and how it supports Philippine cone snail research and
          biodiversity data integration.
        </p>
        <div className="pt-2">
          <Button as={Link} to="/about" variant="primary" size="lg" className="w-full sm:min-w-[260px] sm:w-auto">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
