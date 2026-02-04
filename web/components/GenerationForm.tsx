"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Dices } from "lucide-react"

interface GenerationFormProps {
    onSuccess: (data: any) => void
}

export function GenerationForm({ onSuccess }: GenerationFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        theme: "",
        context: "",
        audience: "",
        tone: "profissional_direto",
        cta_text: "",
        cta_link: "",
        cta_link: "",
        qt_titles: 3,
        qt_images: 2,
        target_phone: "", // New field for WhatsApp Group/Number
        image_url: ""     // Placeholder for image
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
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
            target_phone: "120363403181922610-group", // Default to the known group for testing
            image_url: ""
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // In a real scenario, this connects to the backend API which calls n8n
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            onSuccess(data)
        } catch (error) {
            console.error("Erro ao gerar:", error)
            alert("Erro ao conectar com o agente.")
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
                    Preencha os dados abaixo para acionar o Agente de Conteúdo Base.
                </CardDescription>
                <div className="pt-2">
                    <Button variant="outline" size="sm" onClick={handleLucky} title="Preencher aleatoriamente">
                        <Dices className="w-4 h-4 mr-2" />
                        Estou com Sorte
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
                            placeholder="Ex: Benefícios da automação em clínicas..."
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
                                placeholder="Ex: Veterinários, Gestores..."
                                value={formData.audience}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tone">Tom de Voz</Label>
                            <div className="relative">
                                <select
                                    id="tone"
                                    name="tone"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    value={formData.tone}
                                    onChange={handleChange}
                                >
                                    <option value="profissional_direto">Profissional Direto (Padrão)</option>
                                    <option value="didatico">Didático</option>
                                    <option value="premium">Premium</option>
                                    <option value="leve">Leve</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="context">Contexto Adicional (Dados, datas, valores...)</Label>
                        <Textarea
                            id="context"
                            name="context"
                            placeholder="Cole aqui informações cruciais que NÃO podem ser inventadas."
                            className="h-24 resize-none"
                            value={formData.context}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="cta_text">Texto do CTA (Opcional)</Label>
                            <Input
                                id="cta_text"
                                name="cta_text"
                                placeholder="Ex: Agende uma demonstração"
                                value={formData.cta_text}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cta_link">Link do CTA (Opcional)</Label>
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
                                Gerando Matéria...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Gerar Matéria Base
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
