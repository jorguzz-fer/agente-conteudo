"use client"

import { useState } from "react"
import { GenerationForm } from "@/components/GenerationForm"
import { ResultView } from "@/components/ResultView"

export default function Home() {
  const [result, setResult] = useState<any>(null)

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

        <GenerationForm onSuccess={setResult} />

        {result && <ResultView data={result} />}
      </div>
    </main>
  )
}
