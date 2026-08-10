import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import PillToggle from '../../components/tools/PillToggle'
import { CATEGORIES, getCategory, convertUnits, formatResult } from '../../tools/unitConverter/unitConverter'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/unit-converter')
const structuredData = buildToolStructuredData(tool)

const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({ value: category.id, label: category.label }))

function UnitConverterPage() {
  usePageTitle(
    'Unit Converter: Convert Length, Weight, Temperature & More | FastToolKits',
    'Convert between metric and imperial units for length, weight, temperature, area, volume, and time. Pick a category, choose your units, and get an instant result.',
    { structuredData }
  )

  const [categoryId, setCategoryId] = useState('length')
  const [fromUnitId, setFromUnitId] = useState(CATEGORIES[0].units[0].id)
  const [toUnitId, setToUnitId] = useState(CATEGORIES[0].units[1].id)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const category = getCategory(categoryId)

  const handleCategoryChange = (nextCategoryId) => {
    const nextCategory = getCategory(nextCategoryId)
    setCategoryId(nextCategoryId)
    setFromUnitId(nextCategory.units[0].id)
    setToUnitId(nextCategory.units[1].id)
    setValue('')
    setError('')
    setResult(null)
  }

  const handleValueChange = (nextValue) => {
    setValue(nextValue)
    setError('')
    setResult(null)
  }

  const handleFromUnitChange = (nextUnitId) => {
    setFromUnitId(nextUnitId)
    setError('')
    setResult(null)
  }

  const handleToUnitChange = (nextUnitId) => {
    setToUnitId(nextUnitId)
    setError('')
    setResult(null)
  }

  const handleSwap = () => {
    setFromUnitId(toUnitId)
    setToUnitId(fromUnitId)
    setError('')
    setResult(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { result: convertedValue, error: conversionError } = convertUnits({
      value,
      categoryId,
      fromUnitId,
      toUnitId,
    })

    if (conversionError) {
      setError(conversionError)
      setResult(null)
      return
    }

    setError('')
    setResult(convertedValue)
    trackToolUsage(tool)
  }

  const handleReset = () => {
    setValue('')
    setError('')
    setResult(null)
  }

  const fromUnit = category.units.find((unit) => unit.id === fromUnitId)
  const toUnit = category.units.find((unit) => unit.id === toUnitId)

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <PillToggle label="Category" value={categoryId} onChange={handleCategoryChange} options={CATEGORY_OPTIONS} />

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-6">
          <div>
            <label htmlFor="converter-value" className="mb-2 block text-sm font-medium text-base-content">
              Value
            </label>
            <input
              id="converter-value"
              type="number"
              inputMode="decimal"
              step="any"
              className="input input-bordered w-full"
              value={value}
              onChange={(event) => handleValueChange(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'converter-error' : undefined}
            />
            {error && (
              <p id="converter-error" role="alert" className="mt-2 text-sm text-error">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="converter-from" className="mb-2 block text-sm font-medium text-base-content">
                From
              </label>
              <select
                id="converter-from"
                className="select select-bordered w-full"
                value={fromUnitId}
                onChange={(event) => handleFromUnitChange(event.target.value)}
              >
                {category.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap from and to units"
              className="btn btn-ghost btn-square shrink-0 self-center"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <div className="flex-1">
              <label htmlFor="converter-to" className="mb-2 block text-sm font-medium text-base-content">
                To
              </label>
              <select
                id="converter-to"
                className="select select-bordered w-full"
                value={toUnitId}
                onChange={(event) => handleToUnitChange(event.target.value)}
              >
                {category.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary">
              Convert
            </button>
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
          </div>
        </form>

        {result !== null && (
          <div className="mt-6">
            <ToolResult
              label={`${value} ${fromUnit.label} =`}
              value={`${formatResult(result)} ${toUnit.label}`}
            />
          </div>
        )}
      </div>

      <ToolInfo title="How this works">
        <p>
          Choose a category, pick the unit you&apos;re converting from and to, then enter your
          value. Each category uses standard conversion factors, so results stay reliable across
          metric and imperial units.
        </p>
      </ToolInfo>

      <ToolInfo title="Categories this converter supports">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-base-content">Length:</span> millimeters,
            centimeters, meters, kilometers, inches, feet, yards, miles.
          </li>
          <li>
            <span className="font-medium text-base-content">Weight:</span> milligrams, grams,
            kilograms, ounces, pounds.
          </li>
          <li>
            <span className="font-medium text-base-content">Temperature:</span> Celsius,
            Fahrenheit, Kelvin.
          </li>
          <li>
            <span className="font-medium text-base-content">Area:</span> square meters, square
            kilometers, square feet, square yards, acres.
          </li>
          <li>
            <span className="font-medium text-base-content">Volume:</span> milliliters, liters,
            cubic meters, fluid ounces, cups, gallons.
          </li>
          <li>
            <span className="font-medium text-base-content">Time:</span> seconds, minutes, hours,
            days, weeks.
          </li>
        </ul>
      </ToolInfo>

      <section aria-labelledby="unit-converter-faq-heading">
        <h2 id="unit-converter-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Which units does this converter support?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Length, weight, temperature, area, volume, and time. Each category has its own set
              of units, listed above, and you can convert between any two units within the same
              category.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How do I convert between metric and imperial units?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Pick a category, then set From and To to any units in that category, metric or
              imperial. For example, in Length you can convert directly from miles to kilometers.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is the conversion result rounded?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Results are shown precise to 10 significant figures, with trailing zeros removed, so
              they stay accurate without a long string of unnecessary digits.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Can I convert a negative value?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Temperature can be negative. Other categories, like length or weight, need a value
              of 0 or more, since a negative length or weight doesn&apos;t make sense.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Why does the swap button matter?
            </summary>
            <div className="collapse-content text-sm text-muted">
              It quickly flips your From and To units, which is handy when you want to convert in
              the opposite direction without reselecting both units.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default UnitConverterPage
