export const PERCENTAGE_MODES = {
  OF: 'of',
  IS_WHAT_PERCENT: 'isWhatPercent',
  CHANGE: 'change',
}

function parseNumber(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

function validateRequiredNumber(value, { emptyMessage, invalidMessage }) {
  const parsed = parseNumber(value)
  if (parsed === null) return { error: emptyMessage }
  if (Number.isNaN(parsed)) return { error: invalidMessage }
  return { value: parsed }
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) return '0'
  const rounded = Math.round(value * 100) / 100
  return String(rounded)
}

export function calculatePercentOf({ percentage, baseValue }) {
  const percentResult = validateRequiredNumber(percentage, {
    emptyMessage: 'Please enter a percentage.',
    invalidMessage: 'Please enter a valid percentage.',
  })
  const baseResult = validateRequiredNumber(baseValue, {
    emptyMessage: 'Please enter the value.',
    invalidMessage: 'Please enter a valid value.',
  })

  if (percentResult.error || baseResult.error) {
    return { percentageError: percentResult.error ?? null, baseValueError: baseResult.error ?? null }
  }

  const result = (percentResult.value * baseResult.value) / 100
  return { percentageError: null, baseValueError: null, result }
}

export function calculateIsWhatPercent({ partValue, totalValue }) {
  const partResult = validateRequiredNumber(partValue, {
    emptyMessage: 'Please enter the part.',
    invalidMessage: 'Please enter a valid part.',
  })
  const totalResult = validateRequiredNumber(totalValue, {
    emptyMessage: 'Please enter the total.',
    invalidMessage: 'Please enter a valid total.',
  })

  if (partResult.error || totalResult.error) {
    return { partValueError: partResult.error ?? null, totalValueError: totalResult.error ?? null }
  }

  if (totalResult.value === 0) {
    return { partValueError: null, totalValueError: 'Please enter a total greater than 0.' }
  }

  const result = (partResult.value / totalResult.value) * 100
  return { partValueError: null, totalValueError: null, result }
}

export function calculatePercentChange({ originalValue, newValue }) {
  const originalResult = validateRequiredNumber(originalValue, {
    emptyMessage: 'Please enter the starting value.',
    invalidMessage: 'Please enter a valid starting value.',
  })
  const newResult = validateRequiredNumber(newValue, {
    emptyMessage: 'Please enter the new value.',
    invalidMessage: 'Please enter a valid new value.',
  })

  if (originalResult.error || newResult.error) {
    return { originalValueError: originalResult.error ?? null, newValueError: newResult.error ?? null }
  }

  if (originalResult.value === 0) {
    return { originalValueError: "Please enter a starting value other than 0.", newValueError: null }
  }

  const change = ((newResult.value - originalResult.value) / originalResult.value) * 100
  const direction = change > 0 ? 'increase' : change < 0 ? 'decrease' : 'no change'

  return { originalValueError: null, newValueError: null, result: change, direction }
}
