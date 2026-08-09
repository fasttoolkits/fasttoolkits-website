import QRCode from 'qrcode'

export const MAX_TEXT_LENGTH = 1000

export function validateQrText(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return { error: 'Please enter some text or a link.' }
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return { error: `Please enter shorter text (up to ${MAX_TEXT_LENGTH} characters).` }
  }
  return { value: text.trim() }
}

export async function generateQrCodeDataUrl(text) {
  const validation = validateQrText(text)
  if (validation.error) {
    return { error: validation.error }
  }

  try {
    const dataUrl = await QRCode.toDataURL(validation.value, {
      width: 320,
      margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' },
    })
    return { dataUrl, text: validation.value }
  } catch {
    return { error: 'This text could not be turned into a QR code. Try shorter text.' }
  }
}
