'use client'

import { useState } from 'react'
import { Upload, FileSpreadsheet, Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { parseCSV, parseExcel, validateSpreadsheetData, type ContentRow } from '@/lib/spreadsheet'

export default function SpreadsheetImport() {
    const [file, setFile] = useState<File | null>(null)
    const [data, setData] = useState<ContentRow[]>([])
    const [errors, setErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const [results, setResults] = useState<any>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setErrors([])
        setData([])
        setResults(null)
        setLoading(true)

        try {
            let parsedData: ContentRow[]

            if (selectedFile.name.endsWith('.csv')) {
                parsedData = await parseCSV(selectedFile)
            } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
                parsedData = await parseExcel(selectedFile)
            } else {
                throw new Error('Formato não suportado. Use CSV ou Excel (.xlsx)')
            }

            const validation = validateSpreadsheetData(parsedData)

            if (!validation.valid) {
                setErrors(validation.errors)
            } else {
                setData(validation.data)
            }

        } catch (error: any) {
            setErrors([error.message])
        } finally {
            setLoading(false)
        }
    }

    const handleSendAll = async () => {
        if (data.length === 0) return

        setSending(true)
        setResults(null)

        try {
            const response = await fetch('/api/bulk-publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: data })
            })

            const result = await response.json()
            setResults(result)

        } catch (error: any) {
            setErrors([`Erro ao enviar: ${error.message}`])
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Importar Planilha
                    </CardTitle>
                    <CardDescription>
                        Faça upload de um arquivo CSV ou Excel com as colunas: titulo, subtitulo, texto, image_url (opcional), target_phone
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                            id="spreadsheet-upload"
                        />
                        <label htmlFor="spreadsheet-upload">
                            <Button asChild variant="outline">
                                <span className="cursor-pointer">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Escolher Arquivo
                                </span>
                            </Button>
                        </label>
                        {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
                    </div>

                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processando planilha...
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <h4 className="font-semibold text-destructive mb-2">Erros encontrados:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                                {errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {data.length > 0 && (
                        <>
                            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    ✓ {data.length} {data.length === 1 ? 'item encontrado' : 'itens encontrados'}
                                </p>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="max-h-96 overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted sticky top-0">
                                            <tr>
                                                <th className="p-2 text-left">#</th>
                                                <th className="p-2 text-left">Título</th>
                                                <th className="p-2 text-left">Sub-título</th>
                                                <th className="p-2 text-left">Enviar para</th>
                                                <th className="p-2 text-left">Imagem</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, i) => (
                                                <tr key={i} className="border-t">
                                                    <td className="p-2">{i + 1}</td>
                                                    <td className="p-2 font-medium">{row.titulo}</td>
                                                    <td className="p-2 text-muted-foreground">{row.subtitulo || '-'}</td>
                                                    <td className="p-2">{row.target_phone}</td>
                                                    <td className="p-2">{row.image_url ? '✓' : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <Button
                                onClick={handleSendAll}
                                disabled={sending}
                                className="w-full"
                                size="lg"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Enviando {data.length} {data.length === 1 ? 'item' : 'itens'}...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Enviar Tudo para n8n
                                    </>
                                )}
                            </Button>
                        </>
                    )}

                    {results && (
                        <div className="space-y-2">
                            <div className={`border rounded-lg p-4 ${results.failures === 0 ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'}`}>
                                <p className="font-semibold">
                                    {results.message}
                                </p>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="max-h-60 overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted sticky top-0">
                                            <tr>
                                                <th className="p-2 text-left">Status</th>
                                                <th className="p-2 text-left">Destino</th>
                                                <th className="p-2 text-left">Detalhes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.results?.map((result: any, i: number) => (
                                                <tr key={i} className="border-t">
                                                    <td className="p-2">
                                                        {result.success ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-red-600" />
                                                        )}
                                                    </td>
                                                    <td className="p-2">{result.target}</td>
                                                    <td className="p-2 text-muted-foreground">
                                                        {result.error || 'Enviado com sucesso'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
