const WORDS_PER_MINUTE = 200

function countWords(text) {
  const trimmed = text.trim()
  if (trimmed === '') return 0
  return trimmed.split(/\s+/).length
}

function countCharacters(text) {
  return Array.from(text).length
}

function countCharactersNoSpaces(text) {
  return Array.from(text.replace(/\s/g, '')).length
}

function countSentences(text) {
  const trimmed = text.trim()
  if (trimmed === '') return 0
  const segments = trimmed.split(/[.!?]+/).map((segment) => segment.trim())
  const nonEmpty = segments.filter((segment) => segment !== '')
  return nonEmpty.length
}

function countParagraphs(text) {
  const trimmed = text.trim()
  if (trimmed === '') return 0
  const blocks = trimmed.split(/\n\s*\n/).map((block) => block.trim())
  const nonEmpty = blocks.filter((block) => block !== '')
  return nonEmpty.length
}

function formatReadingTime(words) {
  if (words === 0) return '0 min read'
  const minutes = words / WORDS_PER_MINUTE
  if (minutes < 1) return 'Less than 1 min read'
  return `${Math.round(minutes)} min read`
}

export function getTextStats(text) {
  const safeText = typeof text === 'string' ? text : ''
  const words = countWords(safeText)

  return {
    words,
    characters: countCharacters(safeText),
    charactersNoSpaces: countCharactersNoSpaces(safeText),
    sentences: countSentences(safeText),
    paragraphs: countParagraphs(safeText),
    readingTime: formatReadingTime(words),
  }
}
