export const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export const MIN_LENGTH = 4
export const MAX_LENGTH = 64
export const DEFAULT_LENGTH = 16

export const MAX_WORDS_INPUT_LENGTH = 100
export const MAX_WORD_LENGTH = 20

const WORD_PATTERN = /^[A-Za-z]+$/

function getRandomInt(maxExclusive) {
  const range = 256 - (256 % maxExclusive)
  const bytes = new Uint8Array(1)

  let value
  do {
    crypto.getRandomValues(bytes)
    value = bytes[0]
  } while (value >= range)

  return value % maxExclusive
}

function shuffle(characters) {
  const result = [...characters]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function parseCustomWords(rawInput) {
  if (typeof rawInput !== 'string' || rawInput.trim() === '') {
    return { words: [] }
  }

  const trimmed = rawInput.trim()
  if (trimmed.length > MAX_WORDS_INPUT_LENGTH) {
    return { error: `Please keep this under ${MAX_WORDS_INPUT_LENGTH} characters.` }
  }

  const words = trimmed.split(/\s+/)

  const hasInvalidWord = words.some((word) => !WORD_PATTERN.test(word) || word.length > MAX_WORD_LENGTH)
  if (hasInvalidWord) {
    return {
      error: `Words can only contain letters, with no numbers or symbols. Keep each word to ${MAX_WORD_LENGTH} characters or fewer.`,
    }
  }

  return { words }
}

export function validatePasswordOptions({ length, useUppercase, useLowercase, useNumbers, useSymbols, customWords }) {
  const selectedSets = [
    useUppercase && CHARACTER_SETS.uppercase,
    useLowercase && CHARACTER_SETS.lowercase,
    useNumbers && CHARACTER_SETS.numbers,
    useSymbols && CHARACTER_SETS.symbols,
  ].filter(Boolean)

  if (selectedSets.length === 0) {
    return { error: 'Choose at least one character type (uppercase, lowercase, numbers, or symbols).' }
  }

  const parsedLength = Number(length)
  if (!Number.isFinite(parsedLength) || !Number.isInteger(parsedLength)) {
    return { error: 'Please enter a whole number for the password length.' }
  }
  if (parsedLength < MIN_LENGTH || parsedLength > MAX_LENGTH) {
    return { error: `Please enter a length between ${MIN_LENGTH} and ${MAX_LENGTH}.` }
  }

  const wordsResult = parseCustomWords(customWords)
  if (wordsResult.error) {
    return { error: wordsResult.error }
  }
  const words = wordsResult.words

  if (words.length > 0) {
    if (!useUppercase && !useLowercase) {
      return { error: 'Turn on uppercase or lowercase letters to use custom words, since words are made of letters.' }
    }

    const wordBlockLength = words.join('').length
    const requiredExtras = (useNumbers ? 1 : 0) + (useSymbols ? 1 : 0)
    const minRequiredLength = wordBlockLength + requiredExtras

    if (parsedLength < minRequiredLength) {
      return {
        error: `Your words need at least ${minRequiredLength} characters. Increase the password length or use fewer or shorter words.`,
      }
    }
  } else if (parsedLength < selectedSets.length) {
    return { error: `Length must be at least ${selectedSets.length} to include every character type you chose.` }
  }

  return { length: parsedLength, selectedSets, words, useUppercase, useLowercase, useNumbers, useSymbols }
}

function transformWordCase(word, { useUppercase, useLowercase }) {
  if (useUppercase && useLowercase) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }
  if (useUppercase) return word.toUpperCase()
  return word.toLowerCase()
}

function generateWordBasedPassword({ length, words, useUppercase, useLowercase, useNumbers, useSymbols }) {
  const wordBlock = words.map((word) => transformWordCase(word, { useUppercase, useLowercase })).join('')

  const requiredSets = [useNumbers && CHARACTER_SETS.numbers, useSymbols && CHARACTER_SETS.symbols].filter(Boolean)
  const requiredPadding = requiredSets.map((set) => set[getRandomInt(set.length)])

  const fillSets =
    requiredSets.length > 0
      ? requiredSets
      : [useUppercase && CHARACTER_SETS.uppercase, useLowercase && CHARACTER_SETS.lowercase].filter(Boolean)
  const fillPool = fillSets.join('')

  const fillLength = length - wordBlock.length - requiredPadding.length
  const fillChars = Array.from({ length: fillLength }, () => fillPool[getRandomInt(fillPool.length)])

  const padding = shuffle([...requiredPadding, ...fillChars]).join('')

  return wordBlock + padding
}

function generateRandomPassword({ length, selectedSets }) {
  const requiredChars = selectedSets.map((set) => set[getRandomInt(set.length)])
  const combinedSet = selectedSets.join('')
  const remainingLength = length - requiredChars.length

  const remainingChars = Array.from({ length: remainingLength }, () => combinedSet[getRandomInt(combinedSet.length)])

  return shuffle([...requiredChars, ...remainingChars]).join('')
}

export function generatePassword(options) {
  const validation = validatePasswordOptions(options)
  if (validation.error) {
    return { error: validation.error }
  }

  const password =
    validation.words.length > 0 ? generateWordBasedPassword(validation) : generateRandomPassword(validation)

  return { password, words: validation.words }
}

function getPoolSize({ useUppercase, useLowercase, useNumbers, useSymbols }) {
  return (
    (useUppercase ? CHARACTER_SETS.uppercase.length : 0) +
    (useLowercase ? CHARACTER_SETS.lowercase.length : 0) +
    (useNumbers ? CHARACTER_SETS.numbers.length : 0) +
    (useSymbols ? CHARACTER_SETS.symbols.length : 0)
  )
}

function getPaddingPoolSize({ useUppercase, useLowercase, useNumbers, useSymbols }) {
  const numbersAndSymbols = (useNumbers ? CHARACTER_SETS.numbers.length : 0) + (useSymbols ? CHARACTER_SETS.symbols.length : 0)
  if (numbersAndSymbols > 0) return numbersAndSymbols
  return (useUppercase ? CHARACTER_SETS.uppercase.length : 0) + (useLowercase ? CHARACTER_SETS.lowercase.length : 0)
}

export function getPasswordStrength(password, options) {
  if (!password) return null

  const words = options.customWords || []

  if (words.length > 0) {
    const wordLength = words.join('').length
    const randomLength = Math.max(password.length - wordLength, 0)
    const poolSize = getPaddingPoolSize(options)
    const entropyBits = poolSize > 0 ? randomLength * Math.log2(poolSize) : 0

    const label = entropyBits < 20 ? 'Weak' : 'Fair'
    const variant = label === 'Weak' ? 'error' : 'warning'

    return {
      label,
      variant,
      note: 'This includes words you chose, so it may be easier to guess than a random password of the same length.',
    }
  }

  const poolSize = getPoolSize(options)
  if (poolSize === 0) return null

  const entropyBits = password.length * Math.log2(poolSize)

  if (entropyBits < 40) return { label: 'Weak', variant: 'error', note: null }
  if (entropyBits < 60) return { label: 'Fair', variant: 'warning', note: null }
  if (entropyBits < 80) return { label: 'Strong', variant: 'success', note: null }
  return { label: 'Very strong', variant: 'success', note: null }
}
