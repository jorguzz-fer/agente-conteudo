import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export interface ContentRow {
    titulo: string
    subtitulo: string
    texto: string
    image_url?: string
    target_phone: string
}

export interface ValidationResult {
    valid: boolean
    errors: string[]
    data: ContentRow[]
}

export async function parseCSV(file: File): Promise<ContentRow[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data as ContentRow[])
            },
            error: (error) => {
                reject(new Error(`CSV parsing error: ${error.message}`))
            }
        })
    })
}

export async function parseExcel(file: File): Promise<ContentRow[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = e.target?.result
                const workbook = XLSX.read(data, { type: 'binary' })
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(firstSheet) as ContentRow[]
                resolve(jsonData)
            } catch (error: any) {
                reject(new Error(`Excel parsing error: ${error.message}`))
            }
        }

        reader.onerror = () => {
            reject(new Error('Failed to read Excel file'))
        }

        reader.readAsBinaryString(file)
    })
}

export function validateSpreadsheetData(rows: ContentRow[]): ValidationResult {
    const errors: string[] = []
    const validData: ContentRow[] = []

    if (rows.length === 0) {
        errors.push('A planilha está vazia')
        return { valid: false, errors, data: [] }
    }

    rows.forEach((row, index) => {
        const rowErrors: string[] = []
        const rowNum = index + 2 // +2 because Excel starts at 1 and we have header

        // Check required fields
        if (!row.titulo || row.titulo.trim() === '') {
            rowErrors.push(`Linha ${rowNum}: Título é obrigatório`)
        }

        if (!row.texto || row.texto.trim() === '') {
            rowErrors.push(`Linha ${rowNum}: Texto é obrigatório`)
        }

        if (!row.target_phone || row.target_phone.trim() === '') {
            rowErrors.push(`Linha ${rowNum}: Target phone é obrigatório`)
        }

        if (rowErrors.length > 0) {
            errors.push(...rowErrors)
        } else {
            validData.push({
                titulo: row.titulo.trim(),
                subtitulo: row.subtitulo?.trim() || '',
                texto: row.texto.trim(),
                image_url: row.image_url?.trim() || undefined,
                target_phone: row.target_phone.trim()
            })
        }
    })

    return {
        valid: errors.length === 0,
        errors,
        data: validData
    }
}
