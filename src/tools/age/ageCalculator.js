const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function parseDateInput(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }

  const match = DATE_PATTERN.exec(value.trim())
  if (!match) return NaN

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const date = new Date(year, month - 1, day)
  const isValid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

  return isValid ? date : NaN
}

function diffCalendar(start, end) {
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months -= 1
    const daysInPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate()
    days += daysInPrevMonth
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`
}

export function getTodayDateInputValue() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function validateDateOfBirth(value) {
  const date = parseDateInput(value)
  if (date === null) return { error: 'Please enter your date of birth.' }
  if (Number.isNaN(date)) return { error: 'Please enter a valid date of birth.' }
  return { date }
}

export function validateCalculationDate(value) {
  const date = parseDateInput(value)
  if (date === null) return { error: 'Please enter a calculation date.' }
  if (Number.isNaN(date)) return { error: 'Please enter a valid calculation date.' }
  return { date }
}

export function formatAge(years, months, days) {
  return `${pluralize(years, 'year')}, ${pluralize(months, 'month')}, ${pluralize(days, 'day')}`
}

export function calculateAge({ dateOfBirth, calculationDate }) {
  const dobResult = validateDateOfBirth(dateOfBirth)
  const calcResult = validateCalculationDate(calculationDate)

  if (dobResult.error || calcResult.error) {
    return { dobError: dobResult.error ?? null, calcError: calcResult.error ?? null }
  }

  if (dobResult.date.getTime() > calcResult.date.getTime()) {
    return {
      dobError: 'The calculation date must be on or after your date of birth.',
      calcError: null,
    }
  }

  const { years, months, days } = diffCalendar(dobResult.date, calcResult.date)

  return { dobError: null, calcError: null, years, months, days }
}
