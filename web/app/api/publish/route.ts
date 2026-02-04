import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { full_text, theme, audience, tone, cta, image_url } = body

        // 1. Send to n8n
        const n8nUrl = process.env.N8N_WEBHOOK_URL
        if (n8nUrl) {
            await fetch(n8nUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
        }

        // 2. Save to History (DB)
        if (process.env.DATABASE_URL) {
            await pool.query(
                `INSERT INTO content_generations (input_data, output_data) VALUES ($1, $2)`,
                [
                    JSON.stringify({ theme, audience, tone, cta, image_url }), // Input context
                    JSON.stringify(body) // Full output including text
                ]
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Publish/Save Error:", error)
        return NextResponse.json({ error: "Failed to publish or save" }, { status: 500 })
    }
}
