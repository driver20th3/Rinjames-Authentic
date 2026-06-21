import multer from 'multer'
import { Readable } from 'stream'
import cloudinary from '../../config/cloudinary'

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder = 'shop-products'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        if (result) return resolve(result.secure_url)
        reject(new Error('Upload failed'))
      }
    )

    const readable = new Readable()
    readable.push(file.buffer)
    readable.push(null)
    readable.pipe(uploadStream)
  })
}
