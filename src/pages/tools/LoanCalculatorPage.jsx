import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import PillToggle from '../../components/tools/PillToggle'
import {
  LOAN_TERM_PRESETS,
  DEFAULT_LOAN_TERM_YEARS,
  calculateLoan,
  formatCurrency,
} from '../../tools/loan/loanCalculator'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/loan-calculator')
const structuredData = buildToolStructuredData(tool)

const DEFAULT_TERM_STRING = String(DEFAULT_LOAN_TERM_YEARS)
const CUSTOM_OPTION = 'custom'

const TERM_OPTIONS = [
  ...LOAN_TERM_PRESETS.map((years) => ({ value: String(years), label: `${years} years` })),
  { value: CUSTOM_OPTION, label: 'Custom' },
]

const initialFormState = {
  loanAmount: '',
  interestRate: '',
  loanTermYears: DEFAULT_TERM_STRING,
}

const initialErrors = { loanAmount: '', interestRate: '', loanTermYears: '' }

function LoanCalculatorPage() {
  usePageTitle(
    'Loan Calculator: Estimate Monthly Payments and Interest | FastToolKits',
    'Estimate your monthly loan payment, total repayment, and total interest from the loan amount, interest rate, and term. Informational only, not a lender quote.',
    { structuredData }
  )

  const [termSelection, setTermSelection] = useState(DEFAULT_TERM_STRING)
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState(initialErrors)
  const [result, setResult] = useState(null)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setResult(null)
    setErrors(initialErrors)
  }

  const handleSelectTerm = (selection) => {
    setTermSelection(selection)
    updateField('loanTermYears', selection === CUSTOM_OPTION ? '' : selection)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { amountError, rateError, termError, monthlyPayment, totalPayment, totalInterest, numberOfPayments } =
      calculateLoan(form)

    if (amountError || rateError || termError) {
      setErrors({ loanAmount: amountError ?? '', interestRate: rateError ?? '', loanTermYears: termError ?? '' })
      setResult(null)
      return
    }

    setErrors(initialErrors)
    setResult({ monthlyPayment, totalPayment, totalInterest, numberOfPayments })
    trackToolUsage(tool)
  }

  const handleReset = () => {
    setTermSelection(DEFAULT_TERM_STRING)
    setForm(initialFormState)
    setErrors(initialErrors)
    setResult(null)
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <div>
            <label htmlFor="loan-amount" className="mb-2 block text-sm font-medium text-base-content">
              Loan amount
            </label>
            <input
              id="loan-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className="input input-bordered w-full"
              value={form.loanAmount}
              onChange={(event) => updateField('loanAmount', event.target.value)}
              aria-invalid={Boolean(errors.loanAmount)}
              aria-describedby={errors.loanAmount ? 'loan-amount-error' : undefined}
            />
            {errors.loanAmount && (
              <p id="loan-amount-error" role="alert" className="mt-2 text-sm text-error">
                {errors.loanAmount}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="interest-rate" className="mb-2 block text-sm font-medium text-base-content">
              Interest rate (yearly %)
            </label>
            <input
              id="interest-rate"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className="input input-bordered w-full"
              value={form.interestRate}
              onChange={(event) => updateField('interestRate', event.target.value)}
              aria-invalid={Boolean(errors.interestRate)}
              aria-describedby={errors.interestRate ? 'interest-rate-error' : undefined}
            />
            {errors.interestRate && (
              <p id="interest-rate-error" role="alert" className="mt-2 text-sm text-error">
                {errors.interestRate}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-base-content">Loan term</legend>

            <PillToggle label="Loan term" value={termSelection} onChange={handleSelectTerm} options={TERM_OPTIONS} />

            {termSelection === CUSTOM_OPTION && (
              <div className="mt-3">
                <label htmlFor="loan-term-years" className="mb-2 block text-sm font-medium text-base-content">
                  Custom term (years)
                </label>
                <input
                  id="loan-term-years"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  className="input input-bordered w-full"
                  value={form.loanTermYears}
                  onChange={(event) => updateField('loanTermYears', event.target.value)}
                  aria-invalid={Boolean(errors.loanTermYears)}
                  aria-describedby={errors.loanTermYears ? 'loan-term-error' : undefined}
                />
              </div>
            )}
            {errors.loanTermYears && (
              <p id="loan-term-error" role="alert" className="mt-2 text-sm text-error">
                {errors.loanTermYears}
              </p>
            )}
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary">
              Calculate payment
            </button>
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ToolResult label="Monthly payment" value={formatCurrency(result.monthlyPayment)} />
            <ToolResult label="Total payment" value={formatCurrency(result.totalPayment)} />
            <ToolResult label="Total interest" value={formatCurrency(result.totalInterest)} />
          </div>
        )}

        {result && (
          <p className="mt-4 text-sm text-muted">
            That works out to {result.numberOfPayments} monthly payments of{' '}
            {formatCurrency(result.monthlyPayment)}. In total, you would pay{' '}
            {formatCurrency(result.totalPayment)}, which includes{' '}
            {formatCurrency(result.totalInterest)} in interest.
          </p>
        )}
      </div>

      <p className="text-sm text-muted">
        This tool is for informational purposes only and is not financial advice.
      </p>

      <ToolInfo title="How this is calculated">
        <p>
          This calculator uses the standard fixed-rate loan formula, which assumes equal monthly
          payments over the full term. Your interest rate, fees, taxes, or insurance from a real
          lender may change your actual payment.
        </p>
      </ToolInfo>

      <ToolInfo title="Principal vs. interest">
        <p>
          The principal is the amount you borrow. Interest is the cost of borrowing it, charged
          as a percentage of what you still owe. Each monthly payment covers some interest and
          some principal. Early payments are weighted more toward interest, and later payments
          pay down more principal, even though the payment amount itself stays the same.
        </p>
      </ToolInfo>

      <ToolInfo title="How the loan term affects your payments">
        <p>
          A longer term spreads the same loan amount over more monthly payments, so each payment
          is smaller. But you&apos;re also paying interest for longer, so the total interest paid
          over the life of the loan is higher. A shorter term means larger monthly payments but
          less interest overall.
        </p>
      </ToolInfo>

      <section aria-labelledby="loan-faq-heading">
        <h2 id="loan-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How is the monthly payment calculated?
            </summary>
            <div className="collapse-content text-sm text-muted">
              This calculator uses the standard fixed-rate amortization formula, based on the loan
              amount, the monthly interest rate, and the number of monthly payments. It assumes
              every payment is the same size for the full term.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does a longer loan term reduce monthly payments?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Yes. Spreading the same loan amount over more payments lowers each individual
              payment. The trade-off is more total interest paid over the life of the loan.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What if my interest rate is 0%?
            </summary>
            <div className="collapse-content text-sm text-muted">
              With a 0% interest rate, your monthly payment is simply the loan amount divided by
              the number of monthly payments, and there is no interest to pay.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does this include taxes, insurance, or fees?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. This calculator only estimates principal and interest. Real loans, especially
              mortgages, often include extra costs that are not shown here.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Can I use a loan term that&apos;s not listed?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Yes. Select Custom and enter any loan term in years.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is this a loan offer or approval?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. This is an estimate based on the numbers you enter, not an offer, quote, or
              approval from a lender. A real loan may have a different rate, fees, or terms.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default LoanCalculatorPage
