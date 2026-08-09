export const DEFAULT_COLOR = '#2563eb'

function normalizeHex(value) {
  if (typeof value !== 'string') return null

  let hex = value.trim().replace(/^#/, '')

  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null

  return `#${hex.toLowerCase()}`
}

export function validateHex(value) {
  const normalized = normalizeHex(value)
  if (!normalized) {
    return { error: 'Please enter a valid hex color, like #2563EB.' }
  }
  return { hex: normalized }
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex)
  if (!normalized) return null

  const value = normalized.slice(1)
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }) {
  const toHex = (channel) =>
    Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function rgbToHsl({ r, g, b }) {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const lightness = (max + min) / 2

  let hue = 0
  let saturation = 0

  const delta = max - min
  if (delta !== 0) {
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    if (max === rNorm) {
      hue = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)
    } else if (max === gNorm) {
      hue = (bNorm - rNorm) / delta + 2
    } else {
      hue = (rNorm - gNorm) / delta + 4
    }
    hue *= 60
  }

  return { h: Math.round(hue), s: Math.round(saturation * 100), l: Math.round(lightness * 100) }
}

function hueToRgbChannel(p, q, t) {
  let temp = t
  if (temp < 0) temp += 1
  if (temp > 1) temp -= 1
  if (temp < 1 / 6) return p + (q - p) * 6 * temp
  if (temp < 1 / 2) return q
  if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6
  return p
}

export function hslToRgb({ h, s, l }) {
  const hueNorm = (((h % 360) + 360) % 360) / 360
  const satNorm = s / 100
  const lightNorm = l / 100

  if (satNorm === 0) {
    const value = Math.round(lightNorm * 255)
    return { r: value, g: value, b: value }
  }

  const q = lightNorm < 0.5 ? lightNorm * (1 + satNorm) : lightNorm + satNorm - lightNorm * satNorm
  const p = 2 * lightNorm - q

  return {
    r: Math.round(hueToRgbChannel(p, q, hueNorm + 1 / 3) * 255),
    g: Math.round(hueToRgbChannel(p, q, hueNorm) * 255),
    b: Math.round(hueToRgbChannel(p, q, hueNorm - 1 / 3) * 255),
  }
}

export function formatRgbString({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`
}

export function formatHslString({ h, s, l }) {
  return `hsl(${h}, ${s}%, ${l}%)`
}

export function getShades(hex) {
  const hsl = rgbToHsl(hexToRgb(hex))

  const lighter = [15, 30, 45].map((amount) =>
    rgbToHex(hslToRgb({ ...hsl, l: Math.min(95, hsl.l + amount) }))
  )
  const darker = [15, 30, 45].map((amount) =>
    rgbToHex(hslToRgb({ ...hsl, l: Math.max(5, hsl.l - amount) }))
  )

  return { lighter, darker }
}

export function getComplementary(hex) {
  const hsl = rgbToHsl(hexToRgb(hex))
  return rgbToHex(hslToRgb({ ...hsl, h: (hsl.h + 180) % 360 }))
}

export function getAnalogous(hex) {
  const hsl = rgbToHsl(hexToRgb(hex))
  return [
    rgbToHex(hslToRgb({ ...hsl, h: (hsl.h + 330) % 360 })),
    rgbToHex(hslToRgb({ ...hsl, h: (hsl.h + 30) % 360 })),
  ]
}
