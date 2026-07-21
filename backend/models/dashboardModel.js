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

function entriesFromValueMap(values) {
    return Array.from(values.entries())
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

function sumBy(items, keyGetter, valueGetter) {
    const values = new Map();
    for (const item of items) {
        const key = String(keyGetter(item) ?? "").trim() || "Unknown";
        const value = Number(valueGetter(item) || 0);
        values.set(key, (values.get(key) || 0) + (Number.isFinite(value) ? value : 0));
    }
    return values;
}

function countNonEmpty(rows, getter) {
    return rows.reduce((total, row) => total + (Number(getter(row) || 0) > 0 ? 1 : 0), 0);
}

function normalizeDoi(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\/(dx\.)?doi\.org\//, "")
        .replace(/^doi:\s*/, "")
        .replace(/[.,;\s]+$/, "");
}

function splitDoiList(value) {
    return String(value ?? "")
        .split(/[,;]+/)
        .map(normalizeDoi)
        .filter((item) => item && item !== "unavailable" && item !== "unpublished");
}

function doiListIncludes(value, doi) {
    const normalizedDoi = normalizeDoi(doi);
    if (!normalizedDoi) return false;
    return splitDoiList(value).includes(normalizedDoi);
}

function uniqueCount(rows, idGetter) {
    return new Set(rows.map(idGetter).filter(Boolean)).size;
}

function uniqueSpeciesRows(rows) {
    const grouped = new Map();

    rows.forEach((row) => {
        const key = String(row.scientific_name || row.species_id || "").trim().toLowerCase();
        if (!key || grouped.has(key)) return;
        grouped.set(key, row);
    });

    return Array.from(grouped.values());
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

function toDateString(value) {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
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
            SELECT publication_id, title, authors, year_published, journal, doi, linked_species, linked_conopeptides, linked_biomarkers, created_at
            FROM publication
        `,
    ]);

    const uniqueSpecies = uniqueSpeciesRows(speciesRows);
    const speciesCount = uniqueSpecies.length;
    const conopeptideCount = conopeptideRows.length;
    const biomarkerCount = biomarkerRows.length;
    const publicationCount = publicationRows.length;

    const speciesWithBiomarkerData = new Set(biomarkerRows.map((row) => row.species_name).filter(Boolean)).size;
    const speciesWithConopeptides = new Set(conopeptideRows.map((row) => row.species_name).filter(Boolean)).size;

    const speciesCountsByName = entriesFromValueMap(sumBy(speciesRows, (row) => row.scientific_name, (row) => row.num_conopeptides)).slice(0, 5);
    const conopeptideCountsBySpecies = topEntriesFromCountMap(countBy(conopeptideRows, (row) => row.species_name), 5);
    const biomarkerCountsBySpecies = topEntriesFromCountMap(countBy(biomarkerRows, (row) => row.species_name), 5);
    const provinceCounts = entriesFromCountMap(countBy([...speciesRows, ...biomarkerRows], (row) => row.province)).slice(0, 5);
    const superfamilyCounts = entriesFromCountMap(countBy(conopeptideRows, (row) => row.superfamily)).slice(0, 6);
    const markerTypeCounts = entriesFromCountMap(countBy(biomarkerRows, (row) => row.marker_type)).slice(0, 6);

    const publicationLinkCounts = publicationRows.map((publication) => ({
        publicationId: publication.publication_id,
        linkedSpecies: uniqueCount(
            speciesRows.filter((species) => doiListIncludes(species.doi, publication.doi)),
            (species) => species.species_id,
        ) || Number(publication.linked_species || 0),
        linkedConopeptides: uniqueCount(
            conopeptideRows.filter((conopeptide) => doiListIncludes(conopeptide.doi, publication.doi)),
            (conopeptide) => conopeptide.accession,
        ) || Number(publication.linked_conopeptides || 0),
        linkedBiomarkers: uniqueCount(
            biomarkerRows.filter((biomarker) => doiListIncludes(biomarker.publication_doi, publication.doi)),
            (biomarker) => biomarker.biomarker_id,
        ) || Number(publication.linked_biomarkers || 0),
    }));
    const linkedSpeciesCoverage = countNonEmpty(publicationLinkCounts, (row) => row.linkedSpecies);
    const linkedConopeptideCoverage = countNonEmpty(publicationLinkCounts, (row) => row.linkedConopeptides);
    const linkedBiomarkerCoverage = countNonEmpty(publicationLinkCounts, (row) => row.linkedBiomarkers);

    const topSpeciesName = speciesCountsByName[0]?.name ?? "Unavailable";
    const topConopeptideSpecies = conopeptideCountsBySpecies[0]?.name ?? "Unavailable";
    const topBiomarkerSpecies = biomarkerCountsBySpecies[0]?.name ?? "Unavailable";
    const provinceEntryCounts = entriesFromCountMap(countBy(speciesRows, (row) => row.province));
    const provinceTotal = provinceEntryCounts.reduce((sum, item) => sum + item.value, 0) || 1;
    const topProvinceCounts = provinceEntryCounts.slice(0, 4);
    const specimenDistribution = topProvinceCounts.map((item, index) => ({
        label: item.name,
        value: Number(((item.value / provinceTotal) * 100).toFixed(1)),
        color: ["#111827", "#8ab4f8", "#a8e6cf", "#c7d4f3"][index % 4],
    }));
    const superfamilyTotal = superfamilyCounts.reduce((sum, item) => sum + item.value, 0) || 1;
    const superfamilyBreakdown = superfamilyCounts.map((item, index) => ({
        label: item.name,
        value: Number(((item.value / superfamilyTotal) * 100).toFixed(1)),
        color: ["#8ab4f8", "#5fd0c1", "#111827", "#6fb0ff", "#b79be8", "#71d57d"][index % 6],
    }));
    const discoveryTrendMap = entriesFromCountMap(countBy(publicationRows, (row) => row.year_published)).sort(
        (left, right) => String(left.name).localeCompare(String(right.name)),
    );
    const discoveryTrend = discoveryTrendMap.map((item) => ({
        year: item.name,
        value: item.value,
    }));
    const recentSpecies = [...uniqueSpecies]
        .sort((left, right) => new Date(right.created_at || 0) - new Date(left.created_at || 0))
        .slice(0, 3)
        .map((row, index) => ({
            id: row.species_id,
            name: row.scientific_name,
            publicationDate: toDateString(row.created_at) || row.created_at || "",
            locality: [row.municipality, row.province].filter(Boolean).join(", ") || row.province || "Unavailable",
            status: row.species_id ? "Curated" : "Unavailable",
        }));
    const recentPublications = [...publicationRows]
        .sort((left, right) => new Date(right.created_at || 0) - new Date(left.created_at || 0))
        .slice(0, 3)
        .map((row) => ({
            id: row.publication_id,
            title: row.title,
            journal: row.journal || "Unavailable",
            publicationDate: toDateString(row.created_at) || row.year_published || "",
            authors: row.authors || "Unavailable",
            badge: row.evidence_type || "Publication",
        }));
    const databaseUpdates = [
        {
            id: "UPD-01",
            type: "Species",
            title: `${speciesCount} species records available`,
            detail: "Live species rows are being served from Supabase.",
            date: recentSpecies[0]?.publicationDate || "",
        },
        {
            id: "UPD-02",
            type: "Sequences",
            title: `${conopeptideCount} conopeptide entries indexed`,
            detail: "Superfamily and framework summaries are computed from the live database.",
            date: recentPublications[0]?.publicationDate || "",
        },
        {
            id: "UPD-03",
            type: "Publications",
            title: `${publicationCount} publication records indexed`,
            detail: "Publication cards now read from the live dashboard summary payload.",
            date: recentPublications[0]?.publicationDate || "",
        },
        {
            id: "UPD-04",
            type: "Records",
            title: `${biomarkerCount} biomarker records refreshed`,
            detail: "Biomarker coverage and density are computed server-side.",
            date: recentPublications[0]?.publicationDate || "",
        },
    ];
    const homeMetrics = [
        {
            key: "species-records",
            label: "Species Records",
            value: String(speciesCount),
            delta: `${speciesWithConopeptides} species with conopeptides`,
            tone: "indigo",
            detail: "Curated occurrence records, taxonomy, and specimen-linked metadata.",
        },
        {
            key: "conopeptides",
            label: "Conopeptides",
            value: String(conopeptideCount),
            delta: `${superfamilyCounts.length} superfamilies tracked`,
            tone: "sky",
            detail: "Annotated peptide entries with sequence, family, and publication links.",
        },
    ];

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
            { icon: null, label: "Total Species", value: String(speciesCount), description: "Live record count from Supabase." },
            { icon: null, label: "Conopeptide Precursors", value: String(conopeptideCount), description: "Live record count from Supabase." },
            { icon: null, label: "Biomarkers", value: String(biomarkerCount), description: "Live record count from Supabase." },
            { icon: null, label: "Publications", value: String(publicationCount), description: "Live record count from Supabase." },
        ],
        homeMetrics,
        superfamilyBreakdown,
        specimenDistribution,
        discoveryTrend,
        recentSpecies,
        recentPublications,
        databaseUpdates,
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
