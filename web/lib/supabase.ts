import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null


export async function uploadImageToSupabase(base64Image: string): Promise<string> {
    try {
        // Check if Supabase is configured
        if (!supabase) {
            throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
        }

        // Extract base64 data
        const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/)
        if (!matches) {
            throw new Error('Invalid base64 image format')
        }

        const extension = matches[1]
        const imageData = matches[2]

        // Generate unique filename
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`
        const filepath = `gera-materias/${filename}`

        // Convert base64 to buffer
        const buffer = Buffer.from(imageData, 'base64')


        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('images') // Nome do bucket
            .upload(filepath, buffer, {
                contentType: `image/${extension}`,
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Supabase upload error:', error)
            throw new Error(`Supabase upload failed: ${error.message}`)
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filepath)

        console.log('Image uploaded to Supabase:', publicUrl)
        return publicUrl
    } catch (error: any) {
        console.error('Error uploading to Supabase:', error)
        throw new Error('Failed to upload image to Supabase')
    }
}
