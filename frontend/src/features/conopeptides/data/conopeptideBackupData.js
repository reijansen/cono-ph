const CONOPEPTIDE_BACKUP_PATH = '/backup-data/json/conopeptides/latest.json'

function normalizeRecord(record) {
  return {
    accession: String(record['Conopeptide ID'] ?? record.accession ?? record.conopeptideId ?? record.conopeptide_id ?? ''),
    superfamily: String(record['Gene superfamily'] ?? record.superfamily ?? record.geneSuperfamily ?? record.gene_superfamily ?? ''),
    framework: String(record['Cysteine Framework'] ?? record.framework ?? record.cysteineFramework ?? record.cysteine_framework ?? ''),
    predictedPeptide: String(record['Mature Peptide Sequence'] ?? record.predictedPeptide ?? record.predicted_peptide ?? ''),
    matchedToxin: String(record['Matched Toxin'] ?? record.matchedToxin ?? record.matched_toxin ?? ''),
    species: String(record['Scientific name'] ?? record.species ?? ''),
    province: String(record.Province ?? record.province ?? ''),
  }
}

export async function loadConopeptideBackupRows() {
  const response = await fetch(CONOPEPTIDE_BACKUP_PATH, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Backup conopeptide data not found (${response.status})`)
  }

  const records = await response.json()

  if (!Array.isArray(records)) {
    throw new Error('Backup conopeptide data is not an array')
  }

  return records.map(normalizeRecord).filter((record) => record.accession)
}
