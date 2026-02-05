import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "ski-proj-...", // Fallback useful only for local dev if env is missing, but best to rely on env
})

const SYSTEM_PROMPT = `
# Agente de Criação de Conteúdo Base

## 1️⃣ PAPEL DO AGENTE
Você é um **Agente de Criação de Conteúdo Base**, responsável por gerar matérias estruturadas a partir de um tema fornecido por um mentor em uma interface web.
Seu objetivo é:
- Criar uma matéria base padronizada
- Retornar o conteúdo em JSON estruturado

## 3️⃣ ENTRADA (INPUT JSON)
Você SEMPRE receberá um JSON com os campos abaixo:
- theme (obrigatório)
- context (opcional)
- audience (opcional)
- tone (opcional)
- cta_text (opcional)
- cta_link (opcional)

## 4️⃣ REGRAS ABSOLUTAS (NÃO NEGOCIÁVEIS)
1. **Nunca inventar dados específicos:** Datas, Valores, Locais -> Só use se vierem no context.
2. **Nunca criar links falsos:** Se cta_link estiver vazio, o CTA não pode conter URL.
3. **Emojis:** Máximo de 6. Permitido 🔸 no início de bullets.
4. **Idioma:** Português do Brasil.
5. **Formato:** APENAS JSON válido.

## 6️⃣ SAÍDA (OUTPUT JSON OBRIGATÓRIO)
Você deve retornar exatamente neste formato (nada mais):
{
  "theme": "",
  "audience": "",
  "tone": "",
  "cta": { "text": "", "link": "" },
  "titles": ["", "", ""],
  "image_ideas": ["", ""],
  "lede": "",
  "bullets": ["", "", ""],
  "highlights": ["", ""],
  "full_text": "(Texto completo formatado com TEMA, TÍTULOS, IMAGEM/ARTE, LIDE, CORPO, CTA)",
  "tags": ["", ""]
}
`

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { theme, context, audience, tone, cta_text, cta_link, image_url, image_source, target_phone } = body

        // Prepare payload for OpenAI (exclude image_url to prevent context overflow)
        const aiPayload = {
            theme,
            context,
            audience,
            tone,
            cta_text,
            cta_link
        }

        if (!process.env.OPENAI_API_KEY) {
            // Fallback to Mock if no Key is present (useful for debugging/demo without cost)
            console.warn("OPENAI_API_KEY not found. Using Mock response.")
            await new Promise(resolve => setTimeout(resolve, 1500))
            return NextResponse.json({
                theme,
                full_text: `[MODO MOCK - SEM CHAVE OPENAI]\n\nTEMA: ${theme}\n\nPara gerar conteúdo real, configure a variável OPENAI_API_KEY no Coolify.\n\nEste é um exemplo de visualização.`,
                titles: ["Título Mock 1", "Título Mock 2", "Título Mock 3"],
                image_ideas: ["Imagem Mock"],
                lede: "Lide mockado para teste de interface.",
                bullets: ["Bullet 1", "Bullet 2"],
                highlights: ["Destaque Mock"],
                tags: ["mock", "teste"],
                cta: { text: cta_text || "Saiba mais", link: cta_link }
            })
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost-effective and fast model
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: JSON.stringify(aiPayload) } // Use aiPayload without image
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        })

        const content = completion.choices[0].message.content
        if (!content) throw new Error("No content returned from OpenAI")

        const parsedContent = JSON.parse(content)

        // Validation: Ensure mandatory fields exist
        if (!parsedContent.full_text) {
            console.error("OpenAI Missing Fields:", parsedContent)
            throw new Error("A IA retornou um formato incompleto (faltou full_text). Tente novamente.")
        }

        return NextResponse.json(parsedContent)

    } catch (error: any) {
        console.error("API Error:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}
