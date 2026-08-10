import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import PillToggle from '../../components/tools/PillToggle'
import { TIP_PRESETS, DEFAULT_TIP_PERCENT, calculateTip, formatCurrency } from '../../tools/tip/tipCalculator'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/tip-calculator')
const structuredData = buildToolStructuredData(tool)

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
    'Tip Calculator: Split the Bill & Calculate Gratuity | FastToolKits',
    'Calculate how much to tip and split the bill between friends. Enter your bill amount, choose a tip percentage, and split the total between people.',
    { structuredData }
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
    trackToolUsage(tool)
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

      <ToolInfo title="How much should you tip?">
        <p>
          Tipping customs vary a lot depending on where you are, so treat the following as
          general guidance rather than a fixed rule. In the United States, restaurant service is
          commonly tipped around 15 to 20 percent of the bill. Some bills already include a
          service charge or automatic gratuity, especially for larger groups, so it&apos;s worth
          checking before adding a tip on top.
        </p>
        <p>
          Pick 15%, 18%, or 20% above for a quick answer, or choose Custom to enter your own
          percentage.
        </p>
      </ToolInfo>

      <ToolInfo title="Tipping in the UK and Europe">
        <p>
          Tipping customs vary significantly from country to country, so there is no single
          European standard. In the UK, tipping is generally less expected than in the US, and
          many restaurant bills already include a service charge, so check your bill first.
        </p>
        <p>
          Elsewhere in Europe, customs differ by country. Some places build a service charge
          into the price, while others leave a small tip as optional for good service. When
          you&apos;re unsure, it&apos;s worth checking the guidance for the specific country
          you&apos;re in.
        </p>
      </ToolInfo>

      <ToolInfo title="How to split a bill fairly">
        <p>
          This calculator splits the total evenly by dividing the bill and tip by the number of
          people you enter. That works well when everyone ordered a similar amount.
        </p>
        <p>
          If people ordered very different amounts, an even split may not feel fair. In that
          case, you may want to add up each person&apos;s food and drinks separately before
          applying a tip, since this calculator splits the total evenly rather than by item.
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

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How much should I tip at a restaurant?
            </summary>
            <div className="collapse-content text-sm text-muted">
              In the United States, 15 to 20 percent of the bill is common for restaurant
              service. In many other countries, tipping is smaller or not expected at all, so
              it&apos;s worth checking local customs before you go.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Do I tip on the pre-tax or post-tax amount?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Both approaches are used in practice. Tipping on the pre-tax amount is slightly
              more common, but there is no universal rule, so use whichever amount you&apos;re
              comfortable with.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is tipping expected in the UK?
            </summary>
            <div className="collapse-content text-sm text-muted">
              It&apos;s generally less expected than in the US. Many UK restaurant bills already
              include a service charge, so check your bill before deciding whether to add
              anything extra.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What if the service was bad?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Tipping is meant to reflect the service you received, so it&apos;s reasonable to
              tip less for poor service. If a service charge is already included on the bill,
              check whether it can be adjusted before deciding.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How do I split the bill when people ordered different amounts?
            </summary>
            <div className="collapse-content text-sm text-muted">
              This calculator splits the total evenly between the number of people you enter. If
              everyone ordered a different amount, you&apos;ll need to add up each person&apos;s
              items separately before splitting, since this calculator doesn&apos;t itemise
              individual orders.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default TipCalculatorPage
