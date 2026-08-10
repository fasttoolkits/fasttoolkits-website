export const INDENT_OPTIONS = [
  { value: '2', label: '2 spaces' },
  { value: '4', label: '4 spaces' },
  { value: 'tab', label: 'Tab' },
]

export const DEFAULT_INDENT = '2'

function getIndentValue(indent) {
  return indent === 'tab' ? '\t' : Number(indent)
}

function describeJsonError(error, input) {
  const message = error.message || 'This is not valid JSON.'
  const positionMatch = message.match(/position (\d+)/)

  if (!positionMatch) {
    return message
  }

  const position = Number(positionMatch[1])
  const upToError = input.slice(0, position)
  const line = upToError.split('\n').length
  const lastNewlineIndex = upToError.lastIndexOf('\n')
  const column = position - lastNewlineIndex

  return `${message} (line ${line}, column ${column})`
}

export function formatJson(input, indent = DEFAULT_INDENT) {
  if (input.trim() === '') {
    return { error: 'Enter some JSON to format.' }
  }

  try {
    const parsed = JSON.parse(input)
    return { result: JSON.stringify(parsed, null, getIndentValue(indent)) }
  } catch (error) {
    return { error: describeJsonError(error, input) }
  }
}

export function minifyJson(input) {
  if (input.trim() === '') {
    return { error: 'Enter some JSON to minify.' }
  }

  try {
    const parsed = JSON.parse(input)
    return { result: JSON.stringify(parsed) }
  } catch (error) {
    return { error: describeJsonError(error, input) }
  }
}

export function validateJson(input) {
  if (input.trim() === '') {
    return { valid: false, error: 'Enter some JSON to validate.' }
  }

  try {
    JSON.parse(input)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: describeJsonError(error, input) }
  }
}
