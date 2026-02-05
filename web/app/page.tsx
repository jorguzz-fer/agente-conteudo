"use client"

import { useState } from "react"
import { GenerationForm } from "@/components/GenerationForm"
import { ResultView } from "@/components/ResultView"
import { HistoryList } from "@/components/HistoryList"
import SpreadsheetImport from "@/components/SpreadsheetImport"
import { Button } from "@/components/ui/button"
import { FileText, FileSpreadsheet } from "lucide-react"

type Mode = 'manual' | 'spreadsheet'

export default function Home() {
  const [result, setResult] = useState<any>(null)
  const [mode, setMode] = useState<Mode>('manual')

  const handleReset = () => {
    setResult(null)
    window.location.reload()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Gera Matérias
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Crie conteúdo estruturado, padronizado e pronto para sua base de conhecimento.
          </p>
        </div>

        {!result && (
          <div className="flex gap-2 justify-center">
            <Button
              variant={mode === 'manual' ? 'default' : 'outline'}
              onClick={() => setMode('manual')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Criar Conteúdo Avulso
            </Button>
            <Button
              variant={mode === 'spreadsheet' ? 'default' : 'outline'}
              onClick={() => setMode('spreadsheet')}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Pegar de uma Planilha
            </Button>
          </div>
        )}

        {!result ? (
          <>
            {mode === 'manual' ? (
              <>
                <GenerationForm onSuccess={setResult} />
                <HistoryList />
              </>
            ) : (
              <SpreadsheetImport />
            )}
          </>
        ) : (
          <ResultView data={result} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
