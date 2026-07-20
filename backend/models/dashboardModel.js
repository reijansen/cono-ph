import { sql } from "../config/db.js";

function topEntriesFromCountMap(counts, limit = 5) {
    return Array.from(counts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name))
        .slice(0, limit);
}

function entriesFromCountMap(counts) {
    return Array.from(counts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name));
}

function countBy(items, getter) {
    const counts = new Map();
    for (const item of items) {
        const key = String(getter(item) ?? "").trim() || "Unknown";
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
}

function countNonEmpty(rows, getter) {
    return rows.reduce((total, row) => total + (Number(getter(row) || 0) > 0 ? 1 : 0), 0);
}

function buildConopeptideLengthBins(conopeptideRows) {
    const lengths = conopeptideRows
        .map((row) => Number(row.predictedLength || row.predicted_peptide?.length || 0))
        .filter((length) => length > 0);

    if (!lengths.length) return [];

    const minLength = Math.min(...lengths);
    const maxLength = Math.max(...lengths);
    const binSize = 20;
    const start = Math.floor(minLength / binSize) * binSize;
    const end = Math.ceil(maxLength / binSize) * binSize;
    const bins = [];

    for (let lower = start; lower <= end; lower += binSize) {
        const upper = lower + binSize - 1;
        bins.push({ label: `${lower}-${upper} aa`, min: lower, max: upper, value: 0 });
    }

    for (const length of lengths) {
        const bin = bins.find((item) => length >= item.min && length <= item.max);
        if (bin) bin.value += 1;
    }

    return bins.filter((bin) => bin.value > 0).map(({ label, value }) => ({ range: label, count: value }));
}

export async function getDashboardSummary() {
    const [speciesRows, conopeptideRows, biomarkerRows, publicationRows] = await Promise.all([
        sql`
            SELECT species_id, scientific_name, common_name, province, subgenus, num_conopeptides, created_at
            FROM species
        `,
        sql`
            SELECT accession, species_name, superfamily, framework, predicted_peptide, species_id
            FROM conopeptide
        `,
        sql`
            SELECT biomarker_id, species_name, marker_type, province, accession, sequence_length, validation_status
            FROM biomarker
        `,
        sql`
            SELECT publication_id, title, authors, year_published, journal, doi, linked_species, linked_conopeptides, linked_biomarkers
            FROM publication
        `,
    ]);

    const speciesCount = speciesRows.length;
    const conopeptideCount = conopeptideRows.length;
    const biomarkerCount = biomarkerRows.length;
    const publicationCount = publicationRows.length;

    const speciesWithBiomarkerData = new Set(biomarkerRows.map((row) => row.species_name).filter(Boolean)).size;
    const speciesWithConopeptides = new Set(conopeptideRows.map((row) => row.species_name).filter(Boolean)).size;

    const speciesCountsByName = topEntriesFromCountMap(countBy(speciesRows, (row) => row.scientific_name), 5);
    const conopeptideCountsBySpecies = topEntriesFromCountMap(countBy(conopeptideRows, (row) => row.species_name), 5);
    const biomarkerCountsBySpecies = topEntriesFromCountMap(countBy(biomarkerRows, (row) => row.species_name), 5);
    const provinceCounts = entriesFromCountMap(countBy([...speciesRows, ...biomarkerRows], (row) => row.province)).slice(0, 5);
    const superfamilyCounts = entriesFromCountMap(countBy(conopeptideRows, (row) => row.superfamily)).slice(0, 6);
    const markerTypeCounts = entriesFromCountMap(countBy(biomarkerRows, (row) => row.marker_type)).slice(0, 6);

    const linkedSpeciesCoverage = countNonEmpty(publicationRows, (row) => row.linked_species);
    const linkedConopeptideCoverage = countNonEmpty(publicationRows, (row) => row.linked_conopeptides);
    const linkedBiomarkerCoverage = countNonEmpty(publicationRows, (row) => row.linked_biomarkers);

    const topSpeciesName = speciesCountsByName[0]?.name ?? "Unavailable";
    const topConopeptideSpecies = conopeptideCountsBySpecies[0]?.name ?? "Unavailable";
    const topBiomarkerSpecies = biomarkerCountsBySpecies[0]?.name ?? "Unavailable";

    return {
        summary: {
            speciesCount,
            conopeptideCount,
            biomarkerCount,
            publicationCount,
            speciesWithBiomarkerData,
            speciesWithConopeptides,
            linkedSpeciesCoverage,
            linkedConopeptideCoverage,
            linkedBiomarkerCoverage,
        },
        metrics: [
            { label: "Total Species", value: String(speciesCount) },
            { label: "Conopeptide Precursors", value: String(conopeptideCount) },
            { label: "Biomarkers", value: String(biomarkerCount) },
            { label: "Publications", value: String(publicationCount) },
            {
                label: "Biomarker Coverage",
                value: speciesCount > 0 ? `${Math.round((speciesWithBiomarkerData / speciesCount) * 100)}%` : "0%",
            },
        ],
        overviewCards: [
            {
                id: "species",
                title: "1. Species Overview",
                previewTitle: "Species Distribution by Province",
                viewAllTo: "/visualization/species",
                metricValue: String(speciesCountsByName[0]?.value ?? speciesCount),
                metricDescription: topSpeciesName,
                chartData: entriesFromCountMap(countBy(speciesRows, (row) => row.province)).map((item) => ({
                    name: item.name,
                    value: item.value,
                })),
                listItems: speciesCountsByName,
                listTitle: "Top 5 Most Sequenced Species",
                ctaLabel: "Explore Species",
                ctaTo: "/visualization/species",
            },
            {
                id: "conopeptides",
                title: "2. Conopeptide Overview",
                previewTitle: "Conopeptide Superfamily Distribution",
                viewAllTo: "/visualization/conopeptides",
                metricValue: String(conopeptideCountsBySpecies[0]?.value ?? conopeptideCount),
                metricDescription: topConopeptideSpecies,
                chartData: superfamilyCounts.map((item) => ({ name: item.name, value: item.value })),
                listItems: conopeptideCountsBySpecies,
                listTitle: "Top Species",
                ctaLabel: "Explore Conopeptides",
                ctaTo: "/visualization/conopeptides",
            },
            {
                id: "biomarkers",
                title: "3. Biomarker Overview",
                previewTitle: "Marker Type Distribution",
                viewAllTo: "/visualization/biomarkers",
                metricValue: String(biomarkerCountsBySpecies[0]?.value ?? biomarkerCount),
                metricDescription: topBiomarkerSpecies,
                chartData: markerTypeCounts.map((item) => ({ name: item.name, value: item.value })),
                listItems: biomarkerCountsBySpecies,
                listTitle: "Top Species",
                ctaLabel: "Explore Biomarkers",
                ctaTo: "/visualization/biomarkers",
            },
        ],
        speciesAreaData: entriesFromCountMap(countBy(speciesRows, (row) => row.province)).map((item) => ({
            province: item.name,
            Species: item.value,
        })),
        biomarkerBarData: provinceCounts.map((item) => ({
            name: item.name,
            value: item.value,
        })),
        conopeptideLineData: buildConopeptideLengthBins(conopeptideRows),
        biomarkerCoverageData: [
            { label: "Species with biomarker data", value: speciesWithBiomarkerData },
            { label: "Species without biomarker data", value: Math.max(speciesCount - speciesWithBiomarkerData, 0) },
        ],
        crossDataInsights: {
            summary: [
                {
                    label: "Species with biomarkers",
                    value: String(speciesWithBiomarkerData),
                    hint: speciesCount > 0 ? `${Math.round((speciesWithBiomarkerData / speciesCount) * 100)}% of the species set` : "No species loaded",
                },
                {
                    label: "Species with conopeptides",
                    value: String(speciesWithConopeptides),
                    hint: `${publicationCount} publication records in the same snapshot`,
                },
                {
                    label: "Linked publications",
                    value: String(linkedSpeciesCoverage + linkedConopeptideCoverage + linkedBiomarkerCoverage),
                    hint: "Cross-links captured across the loaded records",
                },
            ],
            highlights: [
                {
                    title: "Coverage focus",
                    body: `Biomarker records span ${speciesWithBiomarkerData} species and ${linkedBiomarkerCoverage} linked publication entries.`,
                },
                {
                    title: "Species signal",
                    body: `Top species leaders are ${topSpeciesName}, ${topConopeptideSpecies}, and ${topBiomarkerSpecies}.`,
                },
                {
                    title: "Evidence links",
                    body: `Cross-record links captured: species ${linkedSpeciesCoverage}, conopeptides ${linkedConopeptideCoverage}, biomarkers ${linkedBiomarkerCoverage}.`,
                },
            ],
        },
    };
}
