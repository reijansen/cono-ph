import { AreaChart, BarList, Card as TremorCard, DonutChart, Text, Title } from '@tremor/react'

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
      <TremorCard className="xl:col-span-2 border border-[var(--app-border)] bg-white p-4 shadow-sm sm:p-5">
        <Title className="text-[1.2rem] text-[var(--app-text)]">Species coverage</Title>
        <Text className="mt-1 text-sm text-[var(--app-muted)]">
          Species distribution by province and sequencing coverage.
        </Text>
        {hasSpeciesAreaData ? (
          <AreaChart
            className="mt-6 h-80"
            data={speciesAreaData}
            index="province"
            categories={['Species']}
            colors={['indigo']}
            yAxisWidth={40}
            showLegend={false}
          />
        ) : (
          <div className="mt-6 flex h-80 items-center justify-center rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-sm text-[var(--app-muted)]">
            No species coverage data available
          </div>
        )}
      </TremorCard>

      <TremorCard className="border border-[var(--app-border)] bg-white p-4 shadow-sm sm:p-5">
        <Title className="text-[1.2rem] text-[var(--app-text)]">Biomarker density</Title>
        <Text className="mt-1 text-sm text-[var(--app-muted)]">Top provinces by biomarker records.</Text>
        <div className="mt-6">
          {hasBiomarkerBarData ? (
            <BarList data={biomarkerBarData} valueFormatter={(value) => `${value}`} />
          ) : (
            <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-sm text-[var(--app-muted)]">
              No biomarker density data available
            </div>
          )}
        </div>
      </TremorCard>

      <TremorCard className="border border-[var(--app-border)] bg-white p-4 shadow-sm sm:p-5">
        <Title className="text-[1.2rem] text-[var(--app-text)]">Conopeptide length bins</Title>
        <Text className="mt-1 text-sm text-[var(--app-muted)]">Sequence length distribution across precursors.</Text>
        {hasConopeptideLineData ? (
          <AreaChart
            className="mt-6 h-72"
            data={conopeptideLineData}
            index="range"
            categories={['count']}
            colors={['amber']}
            yAxisWidth={40}
            showLegend={false}
          />
        ) : (
          <div className="mt-6 flex h-72 items-center justify-center rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-sm text-[var(--app-muted)]">
            No conopeptide length data available
          </div>
        )}
      </TremorCard>

      <TremorCard className="border border-[var(--app-border)] bg-white p-4 shadow-sm sm:p-5">
        <Title className="text-[1.2rem] text-[var(--app-text)]">Coverage snapshot</Title>
        <Text className="mt-1 text-sm text-[var(--app-muted)]">Species with biomarker data vs. without data.</Text>
        <div className="mt-6">
          {hasCoverageData ? (
            <DonutChart
              data={biomarkerCoverageData.map((item) => ({
                name: item.label,
                value: item.value,
              }))}
              category="name"
              value="value"
              variant="donut"
              className="h-72"
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] text-sm text-[var(--app-muted)]">
              No coverage snapshot available
            </div>
          )}
        </div>
      </TremorCard>
    </div>
  )
}
