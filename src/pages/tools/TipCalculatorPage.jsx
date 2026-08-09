import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import PillToggle from '../../components/tools/PillToggle'
import { TIP_PRESETS, DEFAULT_TIP_PERCENT, calculateTip, formatCurrency } from '../../tools/tip/tipCalculator'

const tool = tools.find((item) => item.path === '/tip-calculator')

const DEFAULT_TIP_STRING = String(DEFAULT_TIP_PERCENT)
const CUSTOM_OPTION = 'custom'

const initialFormState = {
  billAmount: '',
  tipPercent: DEFAULT_TIP_STRING,
  peopleCount: '1',
}

const initialErrors = { billAmount: '', tipPercent: '', peopleCount: '' }

const TIP_OPTIONS = [
  ...TIP_PRESETS.map((preset) => ({ value: String(preset), label: `${preset}%` })),
  { value: CUSTOM_OPTION, label: 'Custom' },
]

function TipCalculatorPage() {
  usePageTitle(
    'Tip Calculator | FastToolKits',
    'Free tip calculator: enter the bill amount, choose a tip percentage, and split the total between any number of people.'
  )

  const [tipSelection, setTipSelection] = useState(DEFAULT_TIP_STRING)
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState(initialErrors)
  const [result, setResult] = useState(null)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setResult(null)
    setErrors(initialErrors)
  }

  const handleSelectTip = (selection) => {
    setTipSelection(selection)
    updateField('tipPercent', selection === CUSTOM_OPTION ? '' : selection)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { billError, tipError, peopleError, tipAmount, total, perPerson } = calculateTip(form)

    if (billError || tipError || peopleError) {
      setErrors({ billAmount: billError ?? '', tipPercent: tipError ?? '', peopleCount: peopleError ?? '' })
      setResult(null)
      return
    }

    setErrors(initialErrors)
    setResult({ tipAmount, total, perPerson })
  }

  const handleReset = () => {
    setTipSelection(DEFAULT_TIP_STRING)
    setForm(initialFormState)
    setErrors(initialErrors)
    setResult(null)
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <div>
            <label htmlFor="bill-amount" className="mb-1 block text-sm font-medium text-base-content">
              Bill amount
            </label>
            <p className="mb-2 text-xs text-muted">Enter the total before tip.</p>
            <input
              id="bill-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className="input input-bordered w-full"
              value={form.billAmount}
              onChange={(event) => updateField('billAmount', event.target.value)}
              aria-invalid={Boolean(errors.billAmount)}
              aria-describedby={errors.billAmount ? 'bill-amount-error' : undefined}
            />
            {errors.billAmount && (
              <p id="bill-amount-error" role="alert" className="mt-2 text-sm text-error">
                {errors.billAmount}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-base-content">Tip percentage</legend>

            <PillToggle label="Tip percentage" value={tipSelection} onChange={handleSelectTip} options={TIP_OPTIONS} />

            {tipSelection === CUSTOM_OPTION && (
              <div className="mt-3">
                <label htmlFor="tip-percent" className="mb-2 block text-sm font-medium text-base-content">
                  Custom tip
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="tip-percent"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    className="input input-bordered w-full"
                    value={form.tipPercent}
                    onChange={(event) => updateField('tipPercent', event.target.value)}
                    aria-invalid={Boolean(errors.tipPercent)}
                    aria-describedby={errors.tipPercent ? 'tip-percent-error' : undefined}
                  />
                  <span className="text-sm text-muted">%</span>
                </div>
                {errors.tipPercent && (
                  <p id="tip-percent-error" role="alert" className="mt-2 text-sm text-error">
                    {errors.tipPercent}
                  </p>
                )}
              </div>
            )}
          </fieldset>

          <div>
            <label htmlFor="people-count" className="mb-1 block text-sm font-medium text-base-content">
              Number of people
            </label>
            <p className="mb-2 text-xs text-muted">How many people are splitting the bill?</p>
            <input
              id="people-count"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              className="input input-bordered w-full"
              value={form.peopleCount}
              onChange={(event) => updateField('peopleCount', event.target.value)}
              aria-invalid={Boolean(errors.peopleCount)}
              aria-describedby={errors.peopleCount ? 'people-count-error' : undefined}
            />
            {errors.peopleCount && (
              <p id="people-count-error" role="alert" className="mt-2 text-sm text-error">
                {errors.peopleCount}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary">
              Calculate tip
            </button>
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ToolResult label="Tip" value={formatCurrency(result.tipAmount)} />
            <ToolResult label="Total" value={formatCurrency(result.total)} />
            <ToolResult label="Each person pays" value={formatCurrency(result.perPerson)} />
          </div>
        )}
      </div>

      <ToolInfo title="How this works">
        <p>
          Your tip is the bill amount multiplied by the tip percentage. Add that to the bill to
          get the total. If you&apos;re splitting with others, each person pays the total
          divided by the number of people.
        </p>
      </ToolInfo>

      <ToolInfo title="Choosing a tip percentage">
        <p>
          Pick 15%, 18%, or 20% for a quick answer, or choose Custom to enter your own
          percentage.
        </p>
      </ToolInfo>

      <section aria-labelledby="tip-faq-heading">
        <h2 id="tip-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Can I use a tip percentage that&apos;s not 15%, 18%, or 20%?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Yes. Select Custom and type any percentage you like, including decimals like
              12.5%.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What if I&apos;m the only person paying?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Leave the number of people at 1. &quot;Each person pays&quot; will then show the
              full total: the bill plus the tip.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default TipCalculatorPage
