export const LOAN_TERM_PRESETS = [5, 10, 15, 20, 30]
export const DEFAULT_LOAN_TERM_YEARS = 15

const MAX_LOAN_AMOUNT = 1000000000
const MAX_INTEREST_RATE = 100
const MAX_LOAN_TERM_YEARS = 50

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

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value) {
  return currencyFormatter.format(roundCurrency(value))
}

export function validateLoanAmount(value) {
  const amount = parseNumber(value)
  if (amount === null) return { error: 'Please enter the loan amount.' }
  if (Number.isNaN(amount)) return { error: 'Please enter a valid loan amount.' }
  if (amount <= 0) return { error: 'Please enter a loan amount greater than $0.' }
  if (amount > MAX_LOAN_AMOUNT) return { error: 'Please enter a smaller loan amount.' }
  return { amount }
}

export function validateInterestRate(value) {
  const rate = parseNumber(value)
  if (rate === null) return { error: 'Please enter the interest rate.' }
  if (Number.isNaN(rate)) return { error: 'Please enter a valid interest rate.' }
  if (rate < 0) return { error: 'Please enter an interest rate of 0 or more.' }
  if (rate > MAX_INTEREST_RATE) return { error: `Please enter an interest rate up to ${MAX_INTEREST_RATE}.` }
  return { rate }
}

export function validateLoanTermYears(value) {
  const years = parseNumber(value)
  if (years === null) return { error: 'Please enter the loan term.' }
  if (Number.isNaN(years)) return { error: 'Please enter a valid loan term.' }
  if (years <= 0) return { error: 'Please enter a loan term greater than 0 years.' }
  if (years > MAX_LOAN_TERM_YEARS) return { error: `Please enter a loan term up to ${MAX_LOAN_TERM_YEARS} years.` }
  return { years }
}

export function calculateLoan({ loanAmount, interestRate, loanTermYears }) {
  const amountResult = validateLoanAmount(loanAmount)
  const rateResult = validateInterestRate(interestRate)
  const termResult = validateLoanTermYears(loanTermYears)

  if (amountResult.error || rateResult.error || termResult.error) {
    return {
      amountError: amountResult.error ?? null,
      rateError: rateResult.error ?? null,
      termError: termResult.error ?? null,
    }
  }

  const numberOfPayments = Math.round(termResult.years * 12)

  if (numberOfPayments < 1) {
    return {
      amountError: null,
      rateError: null,
      termError: 'Please enter a longer loan term. It needs to add up to at least 1 month.',
    }
  }

  const monthlyRate = rateResult.rate / 100 / 12

  let monthlyPayment
  if (monthlyRate === 0) {
    monthlyPayment = amountResult.amount / numberOfPayments
  } else {
    const growth = (1 + monthlyRate) ** numberOfPayments
    monthlyPayment = (amountResult.amount * monthlyRate * growth) / (growth - 1)
  }

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - amountResult.amount

  return {
    amountError: null,
    rateError: null,
    termError: null,
    monthlyPayment: roundCurrency(monthlyPayment),
    totalPayment: roundCurrency(totalPayment),
    totalInterest: roundCurrency(totalInterest),
    numberOfPayments,
  }
}
