import { NextResponse } from 'next/server'
import { uploadImageToSupabase } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { image } = await request.json()

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        // Upload to Supabase Storage and get public URL
        const imageUrl = await uploadImageToSupabase(image)

        return NextResponse.json({ url: imageUrl })
    } catch (error: any) {
        console.error('Upload API Error:', error)
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
    }
}
