import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (!process.env.N8N_WEBHOOK_URL) {
            return NextResponse.json({ error: "N8N_WEBHOOK_URL not configured" }, { status: 500 })
        }

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
        console.error("Publish Error:", error)
        return NextResponse.json({ error: "Failed to publish to N8N" }, { status: 502 })
    }
}
