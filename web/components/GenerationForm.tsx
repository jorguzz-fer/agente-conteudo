"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Dices, Upload, Image as ImageIcon } from "lucide-react"

interface GenerationFormProps {
    onSuccess: (data: any) => void
}

export function GenerationForm({ onSuccess }: GenerationFormProps) {
    const [loading, setLoading] = useState(false)
    const [imageSource, setImageSource] = useState<"upload" | "ai">("ai")
    const [formData, setFormData] = useState({
        theme: "",
        context: "",
        audience: "",
        tone: "profissional_direto",
        cta_text: "",
        cta_link: "",
        qt_titles: 3,
        qt_images: 2,
        target_phone: "",
        image_url: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image_url: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleLucky = () => {
        const themes = [
            "Gestão Financeira para Pequenas Empresas",
            "Liderança e Motivação de Equipes",
            "Estratégias de Vendas para o Varejo",
            "Como organizar o fluxo de caixa",
            "Marketing Digital para Negócios Locais"
        ]
        const audiences = ["Pequenos Empresários", "Gerentes de Loja", "Empreendedores", "Profissionais Liberais"]
        const contexts = [
            "Focar em redução de custos sem perder qualidade.",
            "Citar a importância de processos bem definidos.",
            "Usar exemplos de empresas de sucesso.",
            "Mencionar ferramentas de gestão gratuitas."
        ]
        const ctas = [
            { text: "Agende uma consultoria", link: "https://minhaempresa.com.br/agenda" },
            { text: "Baixe nossa planilha de gestão", link: "https://lp.conteudo.com/planilha" },
            { text: "Fale com um especialista", link: "https://wa.me/5511999999999" }
        ]

        const randomRec = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

        const chosenCta = randomRec(ctas)

        setFormData({
            theme: randomRec(themes),
            audience: randomRec(audiences),
            context: randomRec(contexts),
            tone: "profissional_direto",
            cta_text: chosenCta.text,
            cta_link: chosenCta.link,
            qt_titles: 3,
            qt_images: 2,
            target_phone: "120363403181922610-group",
            image_url: ""
        })
        setImageSource("ai")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, image_source: imageSource })
            })

            const data = await response.json()

            if (!response.ok || data.error) {
                throw new Error(data.error || "Erro desconhecido na geração")
            }

            onSuccess({
                ...data,
                user_image: imageSource === "upload" ? formData.image_url : null,
                target_phone: formData.target_phone,
                // Include original form data for n8n
                input_theme: formData.theme,
                input_audience: formData.audience,
                input_tone: formData.tone,
                input_context: formData.context
            })
        } catch (error: any) {
            console.error("Erro ao gerar:", error)
            alert(`Erro: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full border-t-4 border-t-primary shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Gerador de Matérias
                </CardTitle>
                <CardDescription>
                    Preencha os dados abaixo para acionar o Agente de Conteúdo.
                </CardDescription>
                <div className="pt-2">
                    <Button variant="outline" size="sm" onClick={handleLucky} title="Preencher aleatoriamente">
                        <Dices className="w-4 h-4 mr-2" />
                        Estou com Sorte (Gestão)
                    </Button>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="theme" className="text-base">Tema da Matéria <span className="text-destructive">*</span></Label>
                        <Input
                            id="theme"
                            name="theme"
                            placeholder="Ex: Como reduzir custos na empresa..."
                            required
                            value={formData.theme}
                            onChange={handleChange}
                            className="font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="audience">Público Alvo</Label>
                            <Input
                                id="audience"
                                name="audience"
                                placeholder="Ex: Empresários, Lojistas..."
                                value={formData.audience}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="target_phone">Enviar para (ID Grupo/Número) <span className="text-destructive">*</span></Label>
                            <Input
                                id="target_phone"
                                name="target_phone"
                                placeholder="12036...-group"
                                required
                                value={formData.target_phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Imagem do Post</Label>
                        <div className="flex gap-4 mb-2">
                            <Button
                                type="button"
                                variant={imageSource === "ai" ? "default" : "outline"}
                                onClick={() => setImageSource("ai")}
                                className="flex-1"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Sugerir com Nano Banana (AI)
                            </Button>
                            <Button
                                type="button"
                                variant={imageSource === "upload" ? "default" : "outline"}
                                onClick={() => setImageSource("upload")}
                                className="flex-1"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Próprio (1080x1920)
                            </Button>
                        </div>

                        {imageSource === "upload" && (
                            <div className="flex items-center gap-2 border rounded-md p-2 bg-muted/20">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                                {formData.image_url && (
                                    <div className="w-10 h-10 rounded overflow-hidden border">
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        )}
                        {imageSource === "ai" && (
                            <p className="text-xs text-muted-foreground">
                                O agente irá sugerir 3 opções de imagens baseadas no tema.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="context">Contexto Adicional</Label>
                        <Textarea
                            id="context"
                            name="context"
                            placeholder="Informações extras, dados, datas..."
                            className="h-20 resize-none"
                            value={formData.context}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tone">Tom de Voz</Label>
                        <select
                            id="tone"
                            name="tone"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.tone}
                            onChange={handleChange}
                        >
                            <option value="profissional_direto">Profissional Direto</option>
                            <option value="didatico">Didático</option>
                            <option value="premium">Premium</option>
                            <option value="leve">Leve</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="cta_text">Texto do CTA</Label>
                            <Input
                                id="cta_text"
                                name="cta_text"
                                placeholder="Ex: Agende agora"
                                value={formData.cta_text}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cta_link">Link do CTA</Label>
                            <Input
                                id="cta_link"
                                name="cta_link"
                                placeholder="https://..."
                                value={formData.cta_link}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full text-lg h-12" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Gerando {imageSource === "ai" ? "+ Imagens" : ""}...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Gerar Matéria
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
