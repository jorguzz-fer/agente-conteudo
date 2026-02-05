import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { items } = await request.json()

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'No items provided' }, { status: 400 })
        }

        const webhookUrl = process.env.N8N_WEBHOOK_URL

        if (!webhookUrl) {
            console.warn('N8N_WEBHOOK_URL not configured, skipping webhook calls')
            return NextResponse.json({
                message: 'Webhook not configured',
                results: items.map(() => ({ success: false, error: 'Webhook URL not configured' }))
            })
        }

        // Send each item to n8n sequentially
        const results = []

        for (let i = 0; i < items.length; i++) {
            const item = items[i]

            try {
                const payload = {
                    title: item.titulo,
                    subtitle: item.subtitulo,
                    text: item.texto,
                    image_url: item.image_url || null,
                    target_phone: item.target_phone,
                    cta_text: null,
                    cta_link: null,
                    source: 'spreadsheet_import',
                    timestamp: new Date().toISOString()
                }

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                })

                if (response.ok) {
                    results.push({
                        index: i,
                        success: true,
                        target: item.target_phone
                    })
                } else {
                    const errorText = await response.text()
                    results.push({
                        index: i,
                        success: false,
                        error: `Webhook returned ${response.status}: ${errorText}`,
                        target: item.target_phone
                    })
                }

                // Small delay between requests to avoid overwhelming n8n
                if (i < items.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500))
                }

            } catch (error: any) {
                results.push({
                    index: i,
                    success: false,
                    error: error.message,
                    target: item.target_phone
                })
            }
        }

        const successCount = results.filter(r => r.success).length
        const failureCount = results.filter(r => !r.success).length

        return NextResponse.json({
            message: `Enviados: ${successCount} sucesso, ${failureCount} falhas`,
            total: items.length,
            success: successCount,
            failures: failureCount,
            results
        })

    } catch (error: any) {
        console.error('Bulk publish error:', error)
        return NextResponse.json({ error: error.message || 'Failed to publish items' }, { status: 500 })
    }
}
