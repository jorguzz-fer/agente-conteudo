"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, FileJson, FileText } from "lucide-react"

interface ResultViewProps {
    data: any
}

export function ResultView({ data }: ResultViewProps) {
    const [view, setView] = useState<"text" | "json">("text")
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        const content = view === "text" ? data.full_text : JSON.stringify(data, null, 2)
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!data) return null

    return (
        <Card className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Conteúdo Gerado</CardTitle>
                    <CardDescription>
                        Matéria estruturada pronta para uso.
                    </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex bg-muted rounded-md p-1">
                        <Button
                            variant={view === "text" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setView("text")}
                            className="h-8 px-3"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Texto
                        </Button>
                        <Button
                            variant={view === "json" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setView("json")}
                            className="h-8 px-3"
                        >
                            <FileJson className="w-4 h-4 mr-2" />
                            JSON
                        </Button>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="rounded-md border bg-muted p-4 overflow-auto max-h-[600px]">
                    {view === "text" ? (
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                            {data.full_text || "Erro: full_text não encontrado no retorno."}
                        </pre>
                    ) : (
                        <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
