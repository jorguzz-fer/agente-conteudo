
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Loader2 } from "lucide-react"

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
                <div className="space-y-2">
                    {history.map((item) => (
                        <div key={item.id} className="px-4 py-2 bg-background border rounded-md flex items-center justify-between text-sm hover:bg-muted/50 transition-colors">
                            <span className="font-medium text-foreground/90 flex-1 truncate">
                                {item.input_data.theme || "Sem tema"}
                            </span>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground ml-4">
                                <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                                <span>•</span>
                                <span className="truncate max-w-[150px]">{item.input_data.target_phone || "N/A"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
