import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export async function saveImageLocally(base64Image: string): Promise<string> {
    try {
        // Extract base64 data
        const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/)
        if (!matches) {
            throw new Error('Invalid base64 image format')
        }

        const extension = matches[1]
        const imageData = matches[2]

        // Generate unique filename
        const filename = `${crypto.randomBytes(16).toString('hex')}.${extension}`

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
        }

        // Save file
        const filepath = path.join(uploadsDir, filename)
        fs.writeFileSync(filepath, Buffer.from(imageData, 'base64'))

        // Return public URL
        const publicUrl = `/uploads/${filename}`
        console.log('Image saved locally:', publicUrl)

        return publicUrl
    } catch (error: any) {
        console.error('Error saving image locally:', error)
        throw new Error('Failed to save image')
    }
}
