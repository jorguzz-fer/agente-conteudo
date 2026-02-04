import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { theme, context, audience, tone, cta_text, cta_link } = body

        // 1. If N8N_WEBHOOK_URL is defined, forward the request there
        if (process.env.N8N_WEBHOOK_URL) {
            try {
                const response = await fetch(process.env.N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })

                if (!response.ok) {
                    throw new Error(`N8N responded with ${response.status}`)
                }

                const data = await response.json()
                return NextResponse.json(data)
            } catch (error) {
                console.error("Error calling N8N:", error)
                return NextResponse.json({ error: "Falha na comunicação com o agente." }, { status: 502 })
            }
        }

        // 2. MOCK MODE (If no N8N URL)
        await new Promise(resolve => setTimeout(resolve, 2000)) // Fake delay

        const mockResponse = {
            theme: theme,
            audience: audience || "Geral",
            tone: tone || "profissional_direto",
            cta: {
                text: cta_text || "Saiba mais",
                link: cta_link || ""
            },
            titles: [
                `Tudo sobre ${theme}`,
                `3 Dicas essenciais sobre ${theme}`,
                `O que você precisa saber sobre ${theme}`
            ],
            image_ideas: [
                `Foto profissional mostrando ${theme} em contexto prático`,
                `Infográfico resumindo os benefícios de ${theme}`
            ],
            lede: `Descubra como ${theme} pode transformar seus resultados. Uma análise direta e essencial para quem busca eficiência.`,
            bullets: [
                `🔸 Ponto principal sobre ${theme} que todos devem saber.`,
                `🔸 Benefício direto da aplicação correta de ${theme}.`,
                `🔸 Erro comum que deve ser evitado ao lidar com ${theme}.`,
                `🔸 Dica de ouro para maximizar resultados.`
            ],
            highlights: [
                `*Importante*: ${theme} é a tendência do momento.`,
                `*Dica*: Comece hoje mesmo.`
            ],
            tags: ["inovação", "eficiência", "gestão"],
            full_text: `TEMA: ${theme}

TÍTULOS:
1) Tudo sobre ${theme}
2) 3 Dicas essenciais sobre ${theme}
3) O que você precisa saber sobre ${theme}

IMAGEM/ARTE:
A) Foto profissional mostrando ${theme} em contexto prático
B) Infográfico resumindo os benefícios de ${theme}

LIDE:
Descubra como ${theme} pode transformar seus resultados. Uma análise direta e essencial para quem busca eficiência.

CORPO:
🔸 Ponto principal sobre ${theme} que todos devem saber.
🔸 Benefício direto da aplicação correta de ${theme}.
🔸 Erro comum que deve ser evitado ao lidar com ${theme}.
🔸 Dica de ouro para maximizar resultados.

CTA:
${cta_text || "Saiba mais"}`
        }

        return NextResponse.json(mockResponse)

    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
