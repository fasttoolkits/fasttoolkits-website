export const CATEGORIES = [
  {
    id: 'length',
    label: 'Length',
    units: [
      { id: 'mm', label: 'Millimeters', factor: 0.001 },
      { id: 'cm', label: 'Centimeters', factor: 0.01 },
      { id: 'm', label: 'Meters', factor: 1 },
      { id: 'km', label: 'Kilometers', factor: 1000 },
      { id: 'in', label: 'Inches', factor: 0.0254 },
      { id: 'ft', label: 'Feet', factor: 0.3048 },
      { id: 'yd', label: 'Yards', factor: 0.9144 },
      { id: 'mi', label: 'Miles', factor: 1609.344 },
    ],
  },
  {
    id: 'weight',
    label: 'Weight',
    units: [
      { id: 'mg', label: 'Milligrams', factor: 0.001 },
      { id: 'g', label: 'Grams', factor: 1 },
      { id: 'kg', label: 'Kilograms', factor: 1000 },
      { id: 'oz', label: 'Ounces', factor: 28.349523125 },
      { id: 'lb', label: 'Pounds', factor: 453.59237 },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    units: [
      { id: 'c', label: 'Celsius' },
      { id: 'f', label: 'Fahrenheit' },
      { id: 'k', label: 'Kelvin' },
    ],
  },
  {
    id: 'area',
    label: 'Area',
    units: [
      { id: 'm2', label: 'Square meters', factor: 1 },
      { id: 'km2', label: 'Square kilometers', factor: 1000000 },
      { id: 'ft2', label: 'Square feet', factor: 0.09290304 },
      { id: 'yd2', label: 'Square yards', factor: 0.83612736 },
      { id: 'acre', label: 'Acres', factor: 4046.8564224 },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    units: [
      { id: 'ml', label: 'Milliliters', factor: 0.001 },
      { id: 'l', label: 'Liters', factor: 1 },
      { id: 'm3', label: 'Cubic meters', factor: 1000 },
      { id: 'flOz', label: 'Fluid ounces', factor: 0.0295735295625 },
      { id: 'cup', label: 'Cups', factor: 0.2365882365 },
      { id: 'gallon', label: 'Gallons', factor: 3.785411784 },
    ],
  },
  {
    id: 'time',
    label: 'Time',
    units: [
      { id: 's', label: 'Seconds', factor: 1 },
      { id: 'min', label: 'Minutes', factor: 60 },
      { id: 'hr', label: 'Hours', factor: 3600 },
      { id: 'day', label: 'Days', factor: 86400 },
      { id: 'week', label: 'Weeks', factor: 604800 },
    ],
  },
]

const ABSOLUTE_ZERO = { c: -273.15, f: -459.67, k: 0 }

function toCelsius(value, unitId) {
  if (unitId === 'f') return ((value - 32) * 5) / 9
  if (unitId === 'k') return value - 273.15
  return value
}

function fromCelsius(celsius, unitId) {
  if (unitId === 'f') return (celsius * 9) / 5 + 32
  if (unitId === 'k') return celsius + 273.15
  return celsius
}

export function getCategory(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)
}

export function formatResult(value) {
  if (!Number.isFinite(value)) return '0'
  if (value === 0) return '0'
  return Number(value.toPrecision(10)).toString()
}

export function validateConversionValue(value, categoryId, fromUnitId) {
  if (typeof value !== 'string' || value.trim() === '') {
    return { error: 'Please enter a value to convert.' }
  }

  const number = Number(value)
  if (!Number.isFinite(number)) {
    return { error: 'Please enter a valid number.' }
  }

  if (categoryId === 'temperature') {
    const minimum = ABSOLUTE_ZERO[fromUnitId]
    if (minimum !== undefined && number < minimum) {
      return { error: `That is below absolute zero. Please enter a value of ${minimum} or more.` }
    }
    return { value: number }
  }

  if (number < 0) {
    return { error: 'Please enter a value of 0 or more.' }
  }

  return { value: number }
}

export function convertUnits({ value, categoryId, fromUnitId, toUnitId }) {
  const category = getCategory(categoryId)
  if (!category) {
    return { error: 'Please choose a category.' }
  }

  const validation = validateConversionValue(value, categoryId, fromUnitId)
  if (validation.error) {
    return { error: validation.error }
  }

  if (categoryId === 'temperature') {
    const celsius = toCelsius(validation.value, fromUnitId)
    return { result: fromCelsius(celsius, toUnitId) }
  }

  const fromUnit = category.units.find((unit) => unit.id === fromUnitId)
  const toUnit = category.units.find((unit) => unit.id === toUnitId)

  if (!fromUnit || !toUnit) {
    return { error: 'Please choose valid units.' }
  }

  const baseValue = validation.value * fromUnit.factor
  return { result: baseValue / toUnit.factor }
}
