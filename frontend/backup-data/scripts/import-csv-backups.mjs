import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const rootDir = path.resolve(process.cwd(), 'backup-data')
const inputDir = path.join(rootDir, 'csv')
const outputDirs = [
  path.join(rootDir, 'json'),
  path.resolve(process.cwd(), 'public', 'backup-data', 'json'),
]
const datasetNames = ['species', 'conopeptides', 'barcodes', 'publications', 'taxonomic']

function parseCsv(content) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  const pushCell = () => {
    row.push(cell)
    cell = ''
  }

  const pushRow = () => {
    if (row.length > 0) {
      rows.push(row)
    }
    row = []
  }

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index]
    const nextCharacter = content[index + 1]

    if (inQuotes) {
      if (character === '"') {
        if (nextCharacter === '"') {
          cell += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        cell += character
      }
      continue
    }

    if (character === '"') {
      inQuotes = true
      continue
    }

    if (character === ',') {
      pushCell()
      continue
    }

    if (character === '\n') {
      pushCell()
      pushRow()
      continue
    }

    if (character === '\r') {
      continue
    }

    cell += character
  }

  if (cell.length > 0 || row.length > 0) {
    pushCell()
    pushRow()
  }

  if (rows.length === 0) {
    return []
  }

  const headers = rows[0].map((header) => header.trim())
  return rows.slice(1).map((values) => {
    const record = {}
    headers.forEach((header, index) => {
      record[header] = values[index] ?? ''
    })
    return record
  })
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true })
}

async function main() {
  for (const outputDir of outputDirs) {
    await ensureDirectory(outputDir)
  }

  for (const datasetName of datasetNames) {
    const datasetInputDir = path.join(inputDir, datasetName)
    const datasetOutputDirs = outputDirs.map((outputDir) => path.join(outputDir, datasetName))
    for (const datasetOutputDir of datasetOutputDirs) {
      await ensureDirectory(datasetOutputDir)
    }

    let files = []
    try {
      files = await fs.readdir(datasetInputDir)
    } catch {
      continue
    }

    const csvFiles = files.filter((fileName) => fileName.toLowerCase().endsWith('.csv'))

    for (const fileName of csvFiles) {
      const sourcePath = path.join(datasetInputDir, fileName)
      const targetFileName = fileName.replace(/\.csv$/i, '.json')
      const csvContent = await fs.readFile(sourcePath, 'utf8')
      const jsonData = parseCsv(csvContent)
      for (const datasetOutputDir of datasetOutputDirs) {
        const targetPath = path.join(datasetOutputDir, targetFileName)
        const latestPath = path.join(datasetOutputDir, 'latest.json')
        await fs.writeFile(targetPath, `${JSON.stringify(jsonData, null, 2)}\n`, 'utf8')
        await fs.writeFile(latestPath, `${JSON.stringify(jsonData, null, 2)}\n`, 'utf8')
        console.log(`Wrote ${path.relative(process.cwd(), targetPath)}`)
        console.log(`Wrote ${path.relative(process.cwd(), latestPath)}`)
      }
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
