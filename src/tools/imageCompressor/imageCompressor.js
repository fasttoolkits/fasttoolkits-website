export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

export const SUPPORTED_INPUT_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const OUTPUT_FORMATS = [
  { value: 'image/jpeg', label: 'JPEG', extension: 'jpg' },
  { value: 'image/png', label: 'PNG', extension: 'png' },
  { value: 'image/webp', label: 'WebP', extension: 'webp' },
]

export const DEFAULT_QUALITY = 0.8

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function getOutputExtension(outputType) {
  return OUTPUT_FORMATS.find((format) => format.value === outputType)?.extension ?? 'jpg'
}

export function compressImage(file, { quality = DEFAULT_QUALITY, outputType = 'image/jpeg' } = {}) {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ error: 'Please choose an image file.' })
      return
    }

    if (!SUPPORTED_INPUT_TYPES.includes(file.type)) {
      resolve({ error: 'Unsupported file type. Please choose a JPEG, PNG, or WebP image.' })
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      resolve({ error: 'This image is too large. Please choose a file under 20 MB.' })
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        const context = canvas.getContext('2d')

        if (!context) {
          URL.revokeObjectURL(objectUrl)
          resolve({ error: 'This image could not be processed in your browser.' })
          return
        }

        context.drawImage(image, 0, 0)

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl)

            if (!blob) {
              resolve({ error: 'This image could not be compressed. Try a different file or format.' })
              return
            }

            resolve({
              blob,
              url: URL.createObjectURL(blob),
              originalSize: file.size,
              compressedSize: blob.size,
              width: canvas.width,
              height: canvas.height,
            })
          },
          outputType,
          outputType === 'image/png' ? undefined : quality
        )
      } catch {
        URL.revokeObjectURL(objectUrl)
        resolve({ error: 'This image could not be processed. Try a different file.' })
      }
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({ error: 'This file could not be read as an image. It may be corrupt or unsupported.' })
    }

    image.src = objectUrl
  })
}
