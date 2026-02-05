"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, FileJson, FileText, Send, Loader2 } from "lucide-react"

interface ResultViewProps {
    data: any
    onReset?: () => void
}

export function ResultView({ data, onReset }: ResultViewProps) {
    const [view, setView] = useState<"text" | "json">("text")
    const [copied, setCopied] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [published, setPublished] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(data.user_image || null)

    const isAiImageMode = !data.user_image && !selectedImage

    // Generate dynamic AI image suggestions based on theme
    const generateImageSuggestions = () => {
        const queries = ["business", "leadership", "teamwork", "success", "growth", "innovation"]
        const randomQuery = queries[Math.floor(Math.random() * queries.length)]
        const randomSeed = Math.floor(Math.random() * 1000)

        return [
            `https://source.unsplash.com/400x711/?${randomQuery},professional&sig=${randomSeed}`,
            `https://source.unsplash.com/400x711/?${randomQuery},office&sig=${randomSeed + 1}`,
            `https://source.unsplash.com/400x711/?${randomQuery},corporate&sig=${randomSeed + 2}`
        ]
    }

    const mockAiImages = generateImageSuggestions()

    // Use first AI suggestion as default if in AI mode and no image selected
    const effectiveImageUrl = selectedImage || (isAiImageMode ? mockAiImages[0] : null)
    const finalData = { ...data, image_url: effectiveImageUrl }

    const handlePublish = async () => {
        setPublishing(true)
        try {
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            })
            if (res.ok) {
                setPublished(true)
                // Wait 2s and Reset
                setTimeout(() => {
                    if (onReset) onReset()
                }, 2000)
            } else {
                alert("Erro ao enviar. Verifique o N8N_WEBHOOK_URL.")
            }
        } catch (error) {
            console.error(error)
            alert("Erro de conexão.")
        } finally {
            setPublishing(false)
        }
    }

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

                {/* Image Selection Area */}
                {isAiImageMode && (
                    <div className="mb-6 space-y-3">
                        <h3 className="font-semibold text-sm text-foreground/80 flex items-center gap-2">
                            ✨ Sugestões Nano Banana (Mock) - Escolha uma:
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {mockAiImages.map((img, i) => (
                                <div
                                    key={i}
                                    className={`relative aspect-[9/16] rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === img ? "border-primary" : "border-transparent"}`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img src={img} className="object-cover w-full h-full hover:scale-105 transition-transform" alt={`Sugestão ${i}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedImage && !isAiImageMode && (
                    <div className="mb-6 p-2 border rounded-md bg-muted/20">
                        <p className="text-xs text-muted-foreground mb-2">Imagem Selecionada:</p>
                        <img src={selectedImage} alt="Selected" className="h-40 w-auto rounded-md object-cover" />
                    </div>
                )}

                <div className="rounded-md border bg-muted p-4 overflow-auto max-h-[600px] mb-4">
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

                <div className="flex justify-end">
                    <Button
                        onClick={handlePublish}
                        disabled={publishing || published}
                        className={published ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {publishing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : published ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Enviado!
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Aprovar e Publicar
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
