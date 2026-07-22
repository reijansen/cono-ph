import ChartCard from '@/features/visualization/components/ChartCard'
import { AreaChartViz, DonutViz, HorizontalBarChart } from '@/features/visualization/components/DataVizPrimitives'

export default function TrendsSection({
  speciesAreaData,
  biomarkerBarData,
  conopeptideLineData,
  biomarkerCoverageData,
}) {
  const hasSpeciesAreaData = Array.isArray(speciesAreaData) && speciesAreaData.length > 0
  const hasBiomarkerBarData = Array.isArray(biomarkerBarData) && biomarkerBarData.length > 0
  const hasConopeptideLineData = Array.isArray(conopeptideLineData) && conopeptideLineData.length > 0
  const hasCoverageData = Array.isArray(biomarkerCoverageData) && biomarkerCoverageData.length > 0

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <ChartCard title="Species coverage" subtitle="Species distribution by province and sequencing coverage." className="xl:col-span-2">
        <>
        <p className="sr-only">
          Species distribution by province and sequencing coverage.
        </p>
        <AreaChartViz data={hasSpeciesAreaData ? speciesAreaData : []} labelKey="province" valueKey="Species" className="mt-2" />
        </>
      </ChartCard>

      <ChartCard title="Biomarker density" subtitle="Top provinces by biomarker records.">
        <HorizontalBarChart data={hasBiomarkerBarData ? biomarkerBarData : []} className="mt-2" />
      </ChartCard>

      <ChartCard title="Conopeptide length bins" subtitle="Sequence length distribution across precursors.">
        <AreaChartViz data={hasConopeptideLineData ? conopeptideLineData : []} labelKey="range" valueKey="count" className="mt-2" />
      </ChartCard>

      <ChartCard title="Coverage snapshot" subtitle="Species with biomarker data vs. without data.">
        <DonutViz data={hasCoverageData ? biomarkerCoverageData.map((item) => ({ name: item.label, value: item.value })) : []} centerValue={hasCoverageData ? biomarkerCoverageData[0].value : 0} centerLabel="with data" />
      </ChartCard>
    </div>
  )
}
