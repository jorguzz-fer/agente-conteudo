
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Loader2 } from "lucide-react"

interface HistoryItem {
    id: string
    input_data: any
    output_data: any
    created_at: string
}

export function HistoryList() {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [loading, setLoading] = useState(true)

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/history')
            if (res.ok) {
                const data = await res.json()
                setHistory(data)
            }
        } catch (error) {
            console.error("Failed to fetch history:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    if (loading) return <div className="text-center py-4"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
    if (history.length === 0) return null

    return (
        <Card className="w-full mt-12 bg-muted/40 border-dashed">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-5 h-5" />
                    Histórico de Envios
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="p-4 bg-background border rounded-lg flex justify-between items-start shadow-sm">
                            <div className="space-y-1">
                                <h4 className="font-semibold text-foreground/90">{item.input_data.theme || "Sem tema"}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {item.output_data?.lede || "..."}
                                </p>
                                <div className="flex gap-2 text-xs text-muted-foreground pt-1">
                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{item.input_data.target_phone || "Destino desconhecido"}</span>
                                </div>
                            </div>
                            <ButtonVariantIcon />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function ButtonVariantIcon() {
    return (
        <div className="p-2 bg-muted rounded-full text-muted-foreground">
            <FileText className="w-4 h-4" />
        </div>
    )
}
