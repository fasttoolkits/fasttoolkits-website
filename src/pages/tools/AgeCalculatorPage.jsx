import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import { calculateAge, formatAge, getTodayDateInputValue } from '../../tools/age/ageCalculator'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/age-calculator')
const structuredData = buildToolStructuredData(tool)

function createInitialFormState() {
  return { dateOfBirth: '', calculationDate: getTodayDateInputValue() }
}

const initialErrors = { dateOfBirth: '', calculationDate: '' }

function AgeCalculatorPage() {
  usePageTitle(
    'Age Calculator | FastToolKits',
    'Free age calculator: enter your date of birth to instantly find your exact age in years, months, and days as of any calculation date.',
    { structuredData }
  )

  const [form, setForm] = useState(createInitialFormState)
  const [errors, setErrors] = useState(initialErrors)
  const [result, setResult] = useState(null)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setResult(null)
    setErrors(initialErrors)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { dobError, calcError, years, months, days } = calculateAge(form)

    if (dobError || calcError) {
      setErrors({ dateOfBirth: dobError ?? '', calculationDate: calcError ?? '' })
      setResult(null)
      return
    }

    setErrors(initialErrors)
    setResult({ years, months, days })
    trackToolUsage(tool)
  }

  const handleReset = () => {
    setForm(createInitialFormState())
    setErrors(initialErrors)
    setResult(null)
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <div>
            <label htmlFor="date-of-birth" className="mb-2 block text-sm font-medium text-base-content">
              Date of birth
            </label>
            <input
              id="date-of-birth"
              type="date"
              className="input input-bordered w-full"
              value={form.dateOfBirth}
              onChange={(event) => updateField('dateOfBirth', event.target.value)}
              aria-invalid={Boolean(errors.dateOfBirth)}
              aria-describedby={errors.dateOfBirth ? 'date-of-birth-error' : undefined}
            />
            {errors.dateOfBirth && (
              <p id="date-of-birth-error" role="alert" className="mt-2 text-sm text-error">
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="calculation-date" className="mb-1 block text-sm font-medium text-base-content">
              Calculate age as of
            </label>
            <p className="mb-2 text-xs text-muted">Leave this as today, or choose another date.</p>
            <input
              id="calculation-date"
              type="date"
              className="input input-bordered w-full"
              value={form.calculationDate}
              onChange={(event) => updateField('calculationDate', event.target.value)}
              aria-invalid={Boolean(errors.calculationDate)}
              aria-describedby={errors.calculationDate ? 'calculation-date-error' : undefined}
            />
            {errors.calculationDate && (
              <p id="calculation-date-error" role="alert" className="mt-2 text-sm text-error">
                {errors.calculationDate}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary">
              Calculate age
            </button>
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6">
            <ToolResult label="You are" value={`${formatAge(result.years, result.months, result.days)} old`} />
          </div>
        )}
      </div>

      <ToolInfo title="How your age is calculated">
        <p>
          Your age is worked out using calendar dates, not an estimated number of days in a
          year. That keeps it accurate across different month lengths, leap years, and
          birthdays that haven&apos;t happened yet this year.
        </p>
      </ToolInfo>

      <ToolInfo title="Good to know">
        <ul className="list-disc space-y-1 pl-5">
          <li>Your date of birth can&apos;t be after the calculation date.</li>
          <li>If your birthday hasn&apos;t happened yet this year, that&apos;s reflected in the years shown.</li>
          <li>Only the calendar date is used, not the time of day.</li>
        </ul>
      </ToolInfo>

      <section aria-labelledby="age-faq-heading">
        <h2 id="age-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Can I calculate my age on a date other than today?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Yes. Change the &quot;Calculate age as of&quot; date to see your age on any date on
              or after your date of birth.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Why does the calculator account for leap years?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Leap years add an extra day to February. Using calendar dates instead of an
              average year length keeps your age accurate, even across leap years.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default AgeCalculatorPage
