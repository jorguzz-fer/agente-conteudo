
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ error: "Database not configured" }, { status: 500 })
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
