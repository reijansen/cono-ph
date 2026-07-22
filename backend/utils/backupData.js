import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUP_ROOT = path.resolve(__dirname, "../seed-data/json");

async function readJsonArray(...segments) {
    const filePath = path.join(BACKUP_ROOT, ...segments);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
        throw new Error(`Backup file is not an array: ${filePath}`);
    }

    return parsed;
}

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value) {
    if (typeof value === "boolean") return value;
    const normalized = String(value ?? "").trim().toLowerCase();
    return normalized === "true" || normalized === "yes" || normalized === "1";
}

function normalizeDoi(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\/(dx\.)?doi\.org\//, "")
        .replace(/^doi:\s*/, "")
        .replace(/[.,;\s]+$/, "");
}

function splitList(value) {
    return String(value ?? "")
        .split(/[,;]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function splitDoiList(value) {
    return splitList(value)
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

function normalizeImage(value) {
    const link = String(value ?? "").trim();

    if (!link) return "";
    if (link.startsWith("species-image/") || link.startsWith("/species-image/")) return link.startsWith("/") ? link : `/${link}`;
    if (link.startsWith("species-images/") || link.startsWith("/species-images/")) return link.startsWith("/") ? link : `/${link}`;

    const driveMatch = link.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (driveMatch?.[1]) {
        return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }

    return link;
}

export async function loadSpeciesSeedRows() {
    const [speciesRows, taxonomicRows] = await Promise.all([
        readJsonArray("species", "latest.json"),
        readJsonArray("taxonomic", "latest.json"),
    ]);

    const taxonomicBySpeciesId = new Map(
        taxonomicRows.map((record) => {
            const speciesId = String(record["Species ID"] ?? record.speciesId ?? record.species_id ?? record.id ?? "");
            return [
                speciesId,
                {
                    species_id: speciesId,
                    scientific_name: String(record["Scientific name"] ?? record.scientificName ?? record.scientific_name ?? ""),
                    common_name: String(record["Common name"] ?? record.commonName ?? record.common_name ?? ""),
                    class_name: String(record.Class ?? record.className ?? record.class_name ?? ""),
                    order_name: String(record.Order ?? record.orderName ?? record.order_name ?? ""),
                    family_name: String(record.Family ?? record.familyName ?? record.family_name ?? ""),
                    genus_name: String(record.Genus ?? record.genusName ?? record.genus_name ?? ""),
                    subgenus: String(record.Subgenus ?? record.subgenus ?? ""),
                    organisms_diet: String(record["Diet type"] ?? record.dietType ?? record.organisms_diet ?? ""),
                    anatomical_sample: String(record["Tissue source"] ?? record.tissueSource ?? record.anatomical_sample ?? "Venom gland"),
                    tissue_source: String(record["Tissue source"] ?? record.tissueSource ?? record.tissue_source ?? ""),
                },
            ];
        }),
    );

    return speciesRows
        .map((record) => {
            const speciesId = String(record["Species ID"] ?? record.speciesId ?? record.species_id ?? record.id ?? "");
            const taxonomic = taxonomicBySpeciesId.get(speciesId) ?? {};

            return {
                species_id: speciesId,
                scientific_name: String(record["Scientific name"] ?? record.scientificName ?? record.scientific_name ?? ""),
                common_name: String(record["Common name"] ?? record.commonName ?? record.common_name ?? ""),
                subgenus: String(record.Subgenus ?? record.subgenus ?? taxonomic.subgenus ?? ""),
                class_name: String(record.Class ?? record.className ?? record.class_name ?? taxonomic.class_name ?? ""),
                order_name: String(record.Order ?? record.orderName ?? record.order_name ?? taxonomic.order_name ?? ""),
                family_name: String(record.Family ?? record.familyName ?? record.family_name ?? taxonomic.family_name ?? ""),
                genus_name: String(record.Genus ?? record.genusName ?? record.genus_name ?? taxonomic.genus_name ?? ""),
                province: String(record.Province ?? record.province ?? ""),
                municipality: String(record.Municipality ?? record.municipality ?? ""),
                num_conopeptides: toNumber(record["Number of conopeptides"] ?? record.numConopeptides ?? record.num_conopeptides, 0),
                diet_type: String(record["Diet type"] ?? record.diet ?? taxonomic.organisms_diet ?? ""),
                sequencing_platform: String(record["Sequencing platform"] ?? record.sequencingPlatform ?? record.sequencing_platform ?? ""),
                tissue_source: String(record["Tissue source"] ?? record.tissueSource ?? record.tissue_source ?? taxonomic.tissue_source ?? ""),
                raw_data_in_ncbi_sra: toBoolean(record.rawDataInNcbiSra ?? record.raw_data_in_ncbi_sra),
                shell_image: normalizeImage(record["Shell image"] ?? record.image ?? record.imageUrl ?? record.image_url),
                specimen_depositories: String(record["Specimen Depositories"] ?? record.specimenDepositories ?? record.specimen_depositories ?? record.specimenRepository ?? ""),
                project: String(record.Project ?? record.project ?? ""),
                doi: String(record.DOI ?? record.doi ?? ""),
                status: String(record.DOI ?? record.status ?? "Published") === "Unpublished" ? "Unpublished" : "Published",
            };
        })
        .filter((record) => record.species_id);
}

export async function loadTaxonomySeedRows() {
    const records = await readJsonArray("taxonomic", "latest.json");

    return records
        .map((record) => {
            const speciesId = String(record["Species ID"] ?? record.speciesId ?? record.species_id ?? record.id ?? "");

            return {
                species_id: speciesId,
                scientific_name: String(record["Scientific name"] ?? record.scientificName ?? record.scientific_name ?? ""),
                common_name: String(record["Common name"] ?? record.commonName ?? record.common_name ?? ""),
                class_name: String(record.Class ?? record.className ?? record.class_name ?? ""),
                order_name: String(record.Order ?? record.orderName ?? record.order_name ?? ""),
                family_name: String(record.Family ?? record.familyName ?? record.family_name ?? ""),
                genus_name: String(record.Genus ?? record.genusName ?? record.genus_name ?? ""),
                subgenus: String(record.Subgenus ?? record.subgenus ?? ""),
                organisms_diet: String(record["Diet type"] ?? record.dietType ?? ""),
                anatomical_sample: String(record["Tissue source"] ?? record.tissueSource ?? "Venom gland"),
                tissue_source: String(record["Tissue source"] ?? record.tissueSource ?? ""),
            };
        })
        .filter((record) => record.species_id);
}

export async function loadConopeptideSeedRows() {
    const records = await readJsonArray("conopeptides", "latest.json");

    return records
        .map((record) => {
            const accession = String(record["Conopeptide ID"] ?? record.accession ?? record.conopeptideId ?? record.conopeptide_id ?? "");

            return {
                accession,
                species_id: String(record["Species ID"] ?? record.speciesId ?? record.species_id ?? ""),
                species_name: String(record["Scientific name"] ?? record.species ?? record.scientificName ?? ""),
                superfamily: String(record["Gene superfamily"] ?? record.superfamily ?? record.geneSuperfamily ?? record.gene_superfamily ?? ""),
                framework: String(record["Cysteine Framework"] ?? record.framework ?? record.cysteineFramework ?? record.cysteine_framework ?? ""),
                predicted_peptide: String(record["Mature Peptide Sequence"] ?? record.predictedPeptide ?? record.predicted_peptide ?? ""),
                matched_toxin: String(record["Matched Toxin"] ?? record.matchedToxin ?? record.matched_toxin ?? ""),
                precursor_sequence: String(record["Precursor Sequence"] ?? record.precursorSequence ?? record.precursor_sequence ?? ""),
                signal_peptide: String(record["Signal peptide"] ?? record.signalPeptide ?? record.signal_peptide ?? ""),
                propeptide_sequence: String(record["Propeptide sequence"] ?? record.propeptideSequence ?? record.propeptide_sequence ?? ""),
                mature_peptide_sequence: String(record["Mature Peptide Sequence"] ?? record.maturePeptideSequence ?? record.mature_peptide_sequence ?? ""),
                post_peptide_sequence: String(record["Post Peptide Sequence"] ?? record.postPeptideSequence ?? record.post_peptide_sequence ?? ""),
                remarks_sequence: String(record["Remarks for Sequence"] ?? record.remarkSequence ?? record.remarks_sequence ?? ""),
                doi: String(record.DOI ?? record.doi ?? ""),
                percent_similarity: String(record["Percent Similarity"] ?? record.percentSimilarity ?? record.percent_similarity ?? ""),
                source_percent_similarity: String(record["Source of Percent Similarity"] ?? record.sourcePercentSimilarity ?? record.source_percent_similarity ?? ""),
                expression_value: toNumber(record["Expression Value"] ?? record.expressionValue ?? record.expression_value, null),
                precursor_length: toNumber(record["Length of Precursor Sequence"] ?? record.precursorLength ?? record.precursor_length, null),
                mature_length: toNumber(record["Length of Mature Conopeptides"] ?? record.matureLength ?? record.mature_length, null),
                num_cysteine_residues: toNumber(record["Number of Cysteine Residues"] ?? record.numCysteineResidues ?? record.num_cysteine_residues, null),
                cysteine_pattern: String(record["Cysteine Pattern"] ?? record.cysteinePattern ?? record.cysteine_pattern ?? ""),
                cysteine_framework: String(record["Cysteine Framework"] ?? record.cysteineFramework ?? record.cysteine_framework ?? ""),
            };
        })
        .filter((record) => record.accession);
}

export async function loadBiomarkerSeedRows() {
    const records = await readJsonArray("barcodes", "latest.json");

    return records
        .map((record) => {
            const biomarkerId = String(record["Specimen ID"] ?? record.biomarkerId ?? record.biomarker_id ?? "");

            return {
                biomarker_id: biomarkerId,
                species_name: String(record["Species Name"] ?? record.species ?? ""),
                species_id: String(record["Species ID"] ?? record.speciesId ?? record.species_id ?? ""),
                marker_type: String(record["Gene Marker"] ?? record.markerType ?? record.marker_type ?? "Unavailable"),
                province: String(record.Province ?? record.province ?? ""),
                municipality: String(record.Municipality ?? record.municipality ?? ""),
                accession: String(record["External Accession"] ?? record.accession ?? record.externalAccession ?? "Unavailable"),
                sequence_length: toNumber(record["Sequence Length (bp)"] ?? record.sequenceLength ?? record.sequence_length, null),
                sequence: String(record.Sequence ?? record.sequence ?? ""),
                source_method: String(record["Source Method"] ?? record.sourceMethod ?? record.source_method ?? ""),
                sequence_database: String(record["Sequence Database"] ?? record.sequenceDatabase ?? record.sequence_database ?? ""),
                validation_status: String(record["Validation Status of CO1 Sequences"] ?? record.validationStatus ?? record.status ?? "Unavailable"),
                publication_doi: String(record["Publication DOI"] ?? record.publicationDoi ?? record.publication_doi ?? ""),
            };
        })
        .filter((record) => record.biomarker_id);
}

export async function loadPublicationSeedRows() {
    const [records, speciesRows, conopeptideRows, biomarkerRows] = await Promise.all([
        readJsonArray("publications", "latest.json"),
        readJsonArray("species", "latest.json"),
        readJsonArray("conopeptides", "latest.json"),
        readJsonArray("barcodes", "latest.json"),
    ]);

    return records
        .map((record) => {
            const publicationId = String(record["Publication ID"] ?? record.id ?? record.publication_id ?? record.DOI ?? record.Title ?? "");
            const doi = String(record.DOI ?? record.doi ?? "");
            const speciesReported = splitList(record["Species reported"] ?? record.speciesReported ?? record.species_reported);
            const linkedSpecies = speciesReported.length || uniqueCount(
                speciesRows.filter((species) => doiListIncludes(species.DOI ?? species.doi, doi)),
                (species) => species["Species ID"] ?? species.speciesId ?? species.species_id,
            );
            const linkedConopeptides = uniqueCount(
                conopeptideRows.filter((conopeptide) => doiListIncludes(conopeptide.DOI ?? conopeptide.doi, doi)),
                (conopeptide) => conopeptide["Conopeptide ID"] ?? conopeptide.accession ?? conopeptide.conopeptideId,
            );
            const linkedBiomarkers = uniqueCount(
                biomarkerRows.filter((biomarker) => doiListIncludes(biomarker["Publication DOI"] ?? biomarker.publicationDoi ?? biomarker.publication_doi, doi)),
                (biomarker) => biomarker["Specimen ID"] ?? biomarker.biomarkerId ?? biomarker.biomarker_id,
            );

            return {
                publication_id: publicationId,
                title: String(record.Title ?? record.title ?? ""),
                authors: String(record.Authors ?? record.authors ?? ""),
                year_published: String(record["Year Published"] ?? record.Year ?? record.year ?? ""),
                journal: String(record.Journal ?? record.journal ?? ""),
                doi,
                evidence_type: String(record["Evidence Type"] ?? record.evidenceType ?? record.evidence_type ?? ""),
                linked_species: toNumber(record["Linked Species"] ?? record.linkedSpecies ?? record.linked_species, linkedSpecies),
                linked_conopeptides: toNumber(record["Linked Conopeptides"] ?? record.linkedConopeptides ?? record.linked_conopeptides, linkedConopeptides),
                linked_biomarkers: toNumber(record["Linked Biomarkers"] ?? record.linkedBiomarkers ?? record.linked_biomarkers, linkedBiomarkers),
                province: String(record.Province ?? record.province ?? ""),
                status: String(record.Status ?? record.status ?? ""),
            };
        })
        .filter((record) => record.publication_id);
}
