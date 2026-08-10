export const CASE_OPTIONS = [
  { key: 'upper', label: 'UPPERCASE' },
  { key: 'lower', label: 'lowercase' },
  { key: 'sentence', label: 'Sentence case' },
  { key: 'title', label: 'Title Case' },
  { key: 'capitalized', label: 'Capitalized Case' },
  { key: 'alternating', label: 'aLtErNaTiNg CaSe' },
]

const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet',
])

function toUpperCase(text) {
  return text.toUpperCase()
}

function toLowerCase(text) {
  return text.toLowerCase()
}

function toSentenceCase(text) {
  const lower = text.toLowerCase()
  let result = ''
  let capitalizeNext = true

  for (const char of lower) {
    if (capitalizeNext && /[a-z]/.test(char)) {
      result += char.toUpperCase()
      capitalizeNext = false
    } else {
      result += char
      if (char === '.' || char === '!' || char === '?') {
        capitalizeNext = true
      }
    }
  }

  return result
}

function toTitleCase(text) {
  const segments = text.toLowerCase().split(/(\s+)/)
  const wordCount = segments.filter((segment) => segment.trim() !== '').length
  let wordIndex = 0

  return segments
    .map((segment) => {
      if (segment.trim() === '') return segment
      wordIndex += 1
      const isFirst = wordIndex === 1
      const isLast = wordIndex === wordCount
      if (!isFirst && !isLast && MINOR_WORDS.has(segment)) return segment
      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })
    .join('')
}

function toCapitalizedCase(text) {
  return text
    .split(/(\s+)/)
    .map((segment) => {
      if (segment.trim() === '') return segment
      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    })
    .join('')
}

function toAlternatingCase(text) {
  let upper = false
  return text
    .split('')
    .map((char) => {
      if (!/[a-zA-Z]/.test(char)) return char
      const result = upper ? char.toUpperCase() : char.toLowerCase()
      upper = !upper
      return result
    })
    .join('')
}

const CONVERTERS = {
  upper: toUpperCase,
  lower: toLowerCase,
  sentence: toSentenceCase,
  title: toTitleCase,
  capitalized: toCapitalizedCase,
  alternating: toAlternatingCase,
}

export function convertCase(text, caseKey) {
  const convert = CONVERTERS[caseKey]
  if (!convert) return text
  return convert(text)
}
