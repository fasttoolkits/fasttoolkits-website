import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import PillToggle from '../../components/tools/PillToggle'
import {
  PERCENTAGE_MODES,
  calculatePercentOf,
  calculateIsWhatPercent,
  calculatePercentChange,
  formatNumber,
} from '../../tools/percentage/percentageCalculator'

const tool = tools.find((item) => item.path === '/percentage-calculator')

const MODE_OPTIONS = [
  { value: PERCENTAGE_MODES.OF, label: 'What is X% of Y?' },
  { value: PERCENTAGE_MODES.IS_WHAT_PERCENT, label: 'X is what % of Y?' },
  { value: PERCENTAGE_MODES.CHANGE, label: 'Increase or decrease?' },
]

const initialFormState = {
  percentage: '',
  baseValue: '',
  partValue: '',
  totalValue: '',
  originalValue: '',
  newValue: '',
}

const initialErrors = {
  percentage: '',
  baseValue: '',
  partValue: '',
  totalValue: '',
  originalValue: '',
  newValue: '',
}

function PercentageCalculatorPage() {
  usePageTitle(
    'Percentage Calculator | FastToolKits',
    'Free percentage calculator: find what X% of a value is, what percentage one number is of another, or the percentage increase or decrease between two values.'
  )

  const [mode, setMode] = useState(PERCENTAGE_MODES.OF)
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState(initialErrors)
  const [result, setResult] = useState(null)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setResult(null)
    setErrors(initialErrors)
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setForm(initialFormState)
    setErrors(initialErrors)
    setResult(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (mode === PERCENTAGE_MODES.OF) {
      const { percentageError, baseValueError, result: value } = calculatePercentOf(form)
      if (percentageError || baseValueError) {
        setErrors({ ...initialErrors, percentage: percentageError ?? '', baseValue: baseValueError ?? '' })
        setResult(null)
        return
      }
      setErrors(initialErrors)
      setResult({ value })
      return
    }

    if (mode === PERCENTAGE_MODES.IS_WHAT_PERCENT) {
      const { partValueError, totalValueError, result: value } = calculateIsWhatPercent(form)
      if (partValueError || totalValueError) {
        setErrors({ ...initialErrors, partValue: partValueError ?? '', totalValue: totalValueError ?? '' })
        setResult(null)
        return
      }
      setErrors(initialErrors)
      setResult({ value })
      return
    }

    const { originalValueError, newValueError, result: value, direction } = calculatePercentChange(form)
    if (originalValueError || newValueError) {
      setErrors({ ...initialErrors, originalValue: originalValueError ?? '', newValue: newValueError ?? '' })
      setResult(null)
      return
    }
    setErrors(initialErrors)
    setResult({ value, direction })
  }

  const handleReset = () => {
    setMode(PERCENTAGE_MODES.OF)
    setForm(initialFormState)
    setErrors(initialErrors)
    setResult(null)
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <PillToggle
          label="Choose what you want to calculate"
          value={mode}
          onChange={handleModeChange}
          options={MODE_OPTIONS}
        />

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-6">
          {mode === PERCENTAGE_MODES.OF && (
            <>
              <div>
                <label htmlFor="percentage" className="mb-2 block text-sm font-medium text-base-content">
                  Percentage
                </label>
                <input
                  id="percentage"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className="input input-bordered w-full"
                  value={form.percentage}
                  onChange={(event) => updateField('percentage', event.target.value)}
                  aria-invalid={Boolean(errors.percentage)}
                  aria-describedby={errors.percentage ? 'percentage-error' : undefined}
                />
                {errors.percentage && (
                  <p id="percentage-error" role="alert" className="mt-2 text-sm text-error">
                    {errors.percentage}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="base-value" className="mb-2 block text-sm font-medium text-base-content">
                  Value
                </label>
                <input
                  id="base-value"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className="input input-bordered w-full"
                  value={form.baseValue}
                  onChange={(event) => updateField('baseValue', event.target.value)}
                  aria-invalid={Boolean(errors.baseValue)}
                  aria-describedby={errors.baseValue ? 'base-value-error' : undefined}
                />
                {errors.baseValue && (
                  <p id="base-value-error" role="alert" className="mt-2 text-sm text-error">
                    {errors.baseValue}
                  </p>
                )}
              </div>
            </>
          )}

          {mode === PERCENTAGE_MODES.IS_WHAT_PERCENT && (
            <>
              <div>
                <label htmlFor="part-value" className="mb-2 block text-sm font-medium text-base-content">
                  Part
                </label>
                <input
                  id="part-value"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className="input input-bordered w-full"
                  value={form.partValue}
                  onChange={(event) => updateField('partValue', event.target.value)}
                  aria-invalid={Boolean(errors.partValue)}
                  aria-describedby={errors.partValue ? 'part-value-error' : undefined}
                />
                {errors.partValue && (
                  <p id="part-value-error" role="alert" className="mt-2 text-sm text-error">
                    {errors.partValue}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="total-value" className="mb-2 block text-sm font-medium text-base-content">
                  Total
                </label>
                <input
                  id="total-value"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className="input input-bordered w-full"
                  value={form.totalValue}
                  onChange={(event) => updateField('totalValue', event.target.value)}
                  aria-invalid={Boolean(errors.totalValue)}
                  aria-describedby={errors.totalValue ? 'total-value-error' : undefined}
                />
                {errors.totalValue && (
                  <p id="total-value-error" role="alert" className="mt-2 text-sm text-error">
                    {errors.totalValue}
                  </p>
                )}
              </div>
            </>
          )}

          {mode === PERCENTAGE_MODES.CHANGE && (
            <>
              <div>
                <label htmlFor="original-value" className="mb-2 block text-sm font-medium text-base-content">
                  Starting value
                </label>
                <input
                  id="original-value"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className="input input-bordered w-full"
                  value={form.originalValue}
                  onChange={(event) => updateField('originalValue', event.target.value)}
                  aria-invalid={Boolean(errors.originalValue)}
                  aria-describedby={errors.originalValue ? 'original-value-error' : undefined}
                />
                {errors.originalValue && (
                  <p id="original-value-error" role="alert" className="mt-2 text-sm text-error">
                    {errors.originalValue}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="new-value" className="mb-2 block text-sm font-medium text-base-content">
                  New value
                </label>
                <input
                  id="new-value"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className="input input-bordered w-full"
                  value={form.newValue}
                  onChange={(event) => updateField('newValue', event.target.value)}
                  aria-invalid={Boolean(errors.newValue)}
                  aria-describedby={errors.newValue ? 'new-value-error' : undefined}
                />
                {errors.newValue && (
                  <p id="new-value-error" role="alert" className="mt-2 text-sm text-error">
                    {errors.newValue}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary">
              Calculate
            </button>
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
          </div>
        </form>

        {result && mode === PERCENTAGE_MODES.OF && (
          <div className="mt-6">
            <ToolResult label={`${form.percentage}% of ${form.baseValue} is`} value={formatNumber(result.value)} />
          </div>
        )}

        {result && mode === PERCENTAGE_MODES.IS_WHAT_PERCENT && (
          <div className="mt-6">
            <ToolResult
              label={`${form.partValue} is`}
              value={`${formatNumber(result.value)}%`}
              description={`of ${form.totalValue}`}
            />
          </div>
        )}

        {result && mode === PERCENTAGE_MODES.CHANGE && (
          <div className="mt-6">
            <ToolResult
              label="Result"
              value={`${formatNumber(Math.abs(result.value))}%`}
              statusLabel={
                result.direction === 'increase' ? 'Increase' : result.direction === 'decrease' ? 'Decrease' : 'No change'
              }
              statusVariant={
                result.direction === 'increase' ? 'success' : result.direction === 'decrease' ? 'error' : 'info'
              }
              description={`From ${form.originalValue} to ${form.newValue}`}
            />
          </div>
        )}
      </div>

      <ToolInfo title="Increase or decrease, explained">
        <p>
          If the new number is bigger than the starting number, that&apos;s an increase. If
          it&apos;s smaller, that&apos;s a decrease. The percentage is always measured against
          the starting number.
        </p>
      </ToolInfo>

      <ToolInfo title="How the numbers work">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-base-content">What is X% of Y?</span> Multiply the
            percentage by the value, then divide by 100.
          </li>
          <li>
            <span className="font-medium text-base-content">X is what % of Y?</span> Divide the
            part by the total, then multiply by 100.
          </li>
          <li>
            <span className="font-medium text-base-content">Increase or decrease?</span> Subtract
            the starting value from the new value, divide by the starting value, then multiply by
            100.
          </li>
        </ul>
      </ToolInfo>

      <section aria-labelledby="percentage-faq-heading">
        <h2 id="percentage-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Can the values be negative?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Yes, wherever it makes sense (for example, when a value decreases below zero).
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Why can&apos;t the total or starting value be zero?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Dividing by zero doesn&apos;t give a real answer. So the total (for the second
              question) and the starting value (for the third question) both need to be a number
              other than zero.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default PercentageCalculatorPage
