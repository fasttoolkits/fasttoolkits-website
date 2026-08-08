const CM_PER_INCH = 2.54
const INCHES_PER_FOOT = 12
const LB_PER_KG = 2.2046226218

const MIN_HEIGHT_M = 0.5 // 50 cm
const MAX_HEIGHT_M = 2.75 // 275 cm
const MIN_WEIGHT_KG = 2
const MAX_WEIGHT_KG = 500

const MIN_HEIGHT_CM_LABEL = '50 cm'
const MAX_HEIGHT_CM_LABEL = '275 cm'
const MIN_HEIGHT_FT_LABEL = "1'8\""
const MAX_HEIGHT_FT_LABEL = "9'0\""
const MIN_WEIGHT_KG_LABEL = '2 kg'
const MAX_WEIGHT_KG_LABEL = '500 kg'
const MIN_WEIGHT_LB_LABEL = '4 lb'
const MAX_WEIGHT_LB_LABEL = '1100 lb'

export const HEIGHT_UNITS = { CM: 'cm', FT: 'ft' }
export const WEIGHT_UNITS = { KG: 'kg', LB: 'lb' }

export const BMI_CATEGORIES = [
  {
    id: 'underweight',
    label: 'Underweight',
    max: 18.5,
    variant: 'info',
    description: 'Your BMI suggests you may be underweight for your height.',
  },
  {
    id: 'normal',
    label: 'Normal weight',
    max: 25,
    variant: 'success',
    description: 'Your BMI falls within the range generally considered healthy for adults.',
  },
  {
    id: 'overweight',
    label: 'Overweight',
    max: 30,
    variant: 'warning',
    description: 'Your BMI suggests you may be overweight for your height.',
  },
  {
    id: 'obesity',
    label: 'Obesity',
    max: Infinity,
    variant: 'error',
    description: 'Your BMI falls within the range classified as obesity.',
  },
]

function parseNumber(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

export function getBmiCategory(bmi) {
  return BMI_CATEGORIES.find((category) => bmi < category.max)
}

export function validateHeight(heightUnit, { cm, feet, inches }) {
  if (heightUnit === HEIGHT_UNITS.CM) {
    const value = parseNumber(cm)

    if (value === null) return { error: 'Please enter your height.' }
    if (Number.isNaN(value)) return { error: 'Please enter a valid height.' }
    if (value <= 0) return { error: 'Height must be greater than zero.' }

    const meters = value / 100
    if (meters < MIN_HEIGHT_M || meters > MAX_HEIGHT_M) {
      return { error: `Please enter a realistic height (between ${MIN_HEIGHT_CM_LABEL} and ${MAX_HEIGHT_CM_LABEL}).` }
    }

    return { meters }
  }

  const feetEmpty = typeof feet !== 'string' || feet.trim() === ''
  const inchesEmpty = typeof inches !== 'string' || inches.trim() === ''

  if (feetEmpty && inchesEmpty) {
    return { error: 'Please enter your height.' }
  }

  const feetValue = feetEmpty ? 0 : Number(feet)
  const inchesValue = inchesEmpty ? 0 : Number(inches)

  if (!Number.isFinite(feetValue) || !Number.isFinite(inchesValue)) {
    return { error: 'Please enter a valid height.' }
  }
  if (feetValue < 0 || inchesValue < 0) {
    return { error: 'Height cannot be negative.' }
  }
  if (inchesValue >= INCHES_PER_FOOT) {
    return { error: 'Inches must be less than 12.' }
  }
  if (feetValue === 0 && inchesValue === 0) {
    return { error: 'Height must be greater than zero.' }
  }

  const totalInches = feetValue * INCHES_PER_FOOT + inchesValue
  const meters = (totalInches * CM_PER_INCH) / 100

  if (meters < MIN_HEIGHT_M || meters > MAX_HEIGHT_M) {
    return { error: `Please enter a realistic height (between ${MIN_HEIGHT_FT_LABEL} and ${MAX_HEIGHT_FT_LABEL}).` }
  }

  return { meters }
}

export function validateWeight(weightUnit, weight) {
  const value = parseNumber(weight)

  if (value === null) return { error: 'Please enter your weight.' }
  if (Number.isNaN(value)) return { error: 'Please enter a valid weight.' }
  if (value <= 0) return { error: 'Weight must be greater than zero.' }

  const kg = weightUnit === WEIGHT_UNITS.LB ? value / LB_PER_KG : value

  if (kg < MIN_WEIGHT_KG || kg > MAX_WEIGHT_KG) {
    const [minLabel, maxLabel] =
      weightUnit === WEIGHT_UNITS.LB
        ? [MIN_WEIGHT_LB_LABEL, MAX_WEIGHT_LB_LABEL]
        : [MIN_WEIGHT_KG_LABEL, MAX_WEIGHT_KG_LABEL]
    return { error: `Please enter a realistic weight (between ${minLabel} and ${maxLabel}).` }
  }

  return { kg }
}

export function calculateBmi({ heightUnit, heightCm, heightFeet, heightInches, weightUnit, weightValue }) {
  const heightResult = validateHeight(heightUnit, { cm: heightCm, feet: heightFeet, inches: heightInches })
  const weightResult = validateWeight(weightUnit, weightValue)

  if (heightResult.error || weightResult.error) {
    return { heightError: heightResult.error ?? null, weightError: weightResult.error ?? null }
  }

  const bmiValue = weightResult.kg / (heightResult.meters * heightResult.meters)
  const bmi = Math.round(bmiValue * 10) / 10
  const category = getBmiCategory(bmi)

  return { heightError: null, weightError: null, bmi, category }
}
