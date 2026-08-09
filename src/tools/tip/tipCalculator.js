export const TIP_PRESETS = [15, 18, 20]
export const DEFAULT_TIP_PERCENT = 18

function parseNumber(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100
}

export function formatCurrency(value) {
  return `$${roundCurrency(value).toFixed(2)}`
}

export function validateBillAmount(value) {
  const amount = parseNumber(value)
  if (amount === null) return { error: 'Please enter the bill amount.' }
  if (Number.isNaN(amount)) return { error: 'Please enter a valid bill amount.' }
  if (amount <= 0) return { error: 'Please enter a bill amount greater than $0.' }
  return { amount }
}

export function validateTipPercent(value) {
  const percent = parseNumber(value)
  if (percent === null) return { error: 'Please enter a tip percentage.' }
  if (Number.isNaN(percent)) return { error: 'Please enter a valid tip percentage.' }
  if (percent < 0) return { error: 'Please enter a tip percentage of 0 or more.' }
  return { percent }
}

export function validatePeopleCount(value) {
  const count = parseNumber(value)
  if (count === null) return { error: 'Please enter the number of people.' }
  if (Number.isNaN(count)) return { error: 'Please enter a valid number of people.' }
  if (count <= 0) return { error: 'Please enter at least 1 person.' }
  if (!Number.isInteger(count)) return { error: 'Please enter a whole number of people (no decimals).' }
  return { count }
}

export function calculateTip({ billAmount, tipPercent, peopleCount }) {
  const billResult = validateBillAmount(billAmount)
  const tipResult = validateTipPercent(tipPercent)
  const peopleResult = validatePeopleCount(peopleCount)

  if (billResult.error || tipResult.error || peopleResult.error) {
    return {
      billError: billResult.error ?? null,
      tipError: tipResult.error ?? null,
      peopleError: peopleResult.error ?? null,
    }
  }

  const rawTip = (billResult.amount * tipResult.percent) / 100
  const rawTotal = billResult.amount + rawTip
  const rawPerPerson = rawTotal / peopleResult.count

  return {
    billError: null,
    tipError: null,
    peopleError: null,
    tipAmount: roundCurrency(rawTip),
    total: roundCurrency(rawTotal),
    perPerson: roundCurrency(rawPerPerson),
  }
}
