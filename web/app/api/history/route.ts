
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            // Return mock history data when database is not configured
            console.warn("DATABASE_URL not configured. Returning mock history data.")
            return NextResponse.json([
                {
                    id: "mock-1",
                    input_data: {
                        theme: "Gestão Financeira para Pequenas Empresas",
                        audience: "Pequenos Empresários",
                        tone: "profissional_direto",
                        target_phone: "120363403181922610-group"
                    },
                    output_data: {
                        lede: "Descubra como organizar suas finanças e aumentar a lucratividade do seu negócio.",
                        full_text: "Exemplo de matéria sobre gestão financeira..."
                    },
                    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
                },
                {
                    id: "mock-2",
                    input_data: {
                        theme: "Liderança e Motivação de Equipes",
                        audience: "Gerentes",
                        tone: "didatico",
                        target_phone: "120363403181922610-group"
                    },
                    output_data: {
                        lede: "Aprenda técnicas práticas para engajar e motivar sua equipe.",
                        full_text: "Exemplo de matéria sobre liderança..."
                    },
                    created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
                }
            ])
        }

        const result = await pool.query(
            `SELECT id, input_data, output_data, created_at FROM content_generations ORDER BY created_at DESC LIMIT 50`
        )

        return NextResponse.json(result.rows)
    } catch (error) {
        console.error("History API Error:", error)
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }
}
