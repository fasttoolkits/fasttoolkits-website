import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import PillToggle from '../../components/tools/PillToggle'
import { HEIGHT_UNITS, WEIGHT_UNITS, calculateBmi } from '../../tools/bmi/bmiCalculator'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/bmi-calculator')
const structuredData = buildToolStructuredData(tool)

const initialFormState = {
  heightUnit: HEIGHT_UNITS.CM,
  weightUnit: WEIGHT_UNITS.KG,
  heightCm: '',
  heightFeet: '',
  heightInches: '',
  weightValue: '',
}

const initialErrors = { height: '', weight: '' }

function BmiCalculatorPage() {
  usePageTitle(
    'BMI Calculator: Check Your Body Mass Index | FastToolKits',
    'Enter your height and weight to calculate your BMI instantly. See your BMI number, your weight category, and what your result means. Free, no signup.',
    { structuredData }
  )

  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState(initialErrors)
  const [result, setResult] = useState(null)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setResult(null)
    setErrors(initialErrors)
  }

  const handleHeightUnitChange = (heightUnit) => {
    setForm((prev) => ({ ...prev, heightUnit, heightCm: '', heightFeet: '', heightInches: '' }))
    setResult(null)
    setErrors(initialErrors)
  }

  const handleWeightUnitChange = (weightUnit) => {
    setForm((prev) => ({ ...prev, weightUnit, weightValue: '' }))
    setResult(null)
    setErrors(initialErrors)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { heightError, weightError, bmi, category } = calculateBmi(form)

    if (heightError || weightError) {
      setErrors({ height: heightError ?? '', weight: weightError ?? '' })
      setResult(null)
      return
    }

    setErrors(initialErrors)
    setResult({ bmi, category })
    trackToolUsage(tool)
  }

  const handleReset = () => {
    setForm(initialFormState)
    setErrors(initialErrors)
    setResult(null)
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-base-content">Height</legend>

            <PillToggle
              label="Height unit"
              value={form.heightUnit}
              onChange={handleHeightUnitChange}
              options={[
                { value: HEIGHT_UNITS.CM, label: 'Centimeters' },
                { value: HEIGHT_UNITS.FT, label: 'Feet & inches' },
              ]}
            />

            {form.heightUnit === HEIGHT_UNITS.CM ? (
              <div className="mt-3">
                <label htmlFor="height-cm" className="mb-2 block text-sm font-medium text-base-content">
                  Height (cm)
                </label>
                <input
                  id="height-cm"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  className="input input-bordered w-full"
                  value={form.heightCm}
                  onChange={(event) => updateField('heightCm', event.target.value)}
                  aria-invalid={Boolean(errors.height)}
                  aria-describedby={errors.height ? 'height-error' : undefined}
                />
              </div>
            ) : (
              <div className="mt-3 flex gap-3">
                <div className="flex-1">
                  <label htmlFor="height-feet" className="mb-2 block text-sm font-medium text-base-content">
                    Feet
                  </label>
                  <input
                    id="height-feet"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    className="input input-bordered w-full"
                    value={form.heightFeet}
                    onChange={(event) => updateField('heightFeet', event.target.value)}
                    aria-invalid={Boolean(errors.height)}
                    aria-describedby={errors.height ? 'height-error' : undefined}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="height-inches" className="mb-2 block text-sm font-medium text-base-content">
                    Inches
                  </label>
                  <input
                    id="height-inches"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="11.9"
                    step="0.1"
                    className="input input-bordered w-full"
                    value={form.heightInches}
                    onChange={(event) => updateField('heightInches', event.target.value)}
                    aria-invalid={Boolean(errors.height)}
                    aria-describedby={errors.height ? 'height-error' : undefined}
                  />
                </div>
              </div>
            )}

            {errors.height && (
              <p id="height-error" role="alert" className="mt-2 text-sm text-error">
                {errors.height}
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-base-content">Weight</legend>

            <PillToggle
              label="Weight unit"
              value={form.weightUnit}
              onChange={handleWeightUnitChange}
              options={[
                { value: WEIGHT_UNITS.KG, label: 'Kilograms' },
                { value: WEIGHT_UNITS.LB, label: 'Pounds' },
              ]}
            />

            <div className="mt-3">
              <label htmlFor="weight-value" className="mb-2 block text-sm font-medium text-base-content">
                Weight ({form.weightUnit === WEIGHT_UNITS.KG ? 'kg' : 'lb'})
              </label>
              <input
                id="weight-value"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                className="input input-bordered w-full"
                value={form.weightValue}
                onChange={(event) => updateField('weightValue', event.target.value)}
                aria-invalid={Boolean(errors.weight)}
                aria-describedby={errors.weight ? 'weight-error' : undefined}
              />
            </div>

            {errors.weight && (
              <p id="weight-error" role="alert" className="mt-2 text-sm text-error">
                {errors.weight}
              </p>
            )}
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary">
              Calculate BMI
            </button>
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6">
            <ToolResult
              label="Your BMI"
              value={result.bmi}
              statusLabel={result.category.label}
              statusVariant={result.category.variant}
              description={result.category.description}
            />
          </div>
        )}
      </div>

      <ToolInfo title="What do the BMI categories mean?">
        <p>
          These are the standard adult BMI categories. Normal weight is generally classified as
          a healthy weight range for adults, but BMI is a screening measure, not a diagnosis, and
          it does not provide a complete assessment of your health on its own.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Underweight: below 18.5</li>
          <li>Normal weight: 18.5 to 24.9</li>
          <li>Overweight: 25.0 to 29.9</li>
          <li>Obesity: 30.0 and above</li>
        </ul>
      </ToolInfo>

      <ToolInfo title="What BMI does not tell you">
        <p>BMI is a useful screening measure, but on its own it:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Does not directly measure body fat</li>
          <li>Cannot tell the difference between muscle and fat</li>
          <li>May be less informative for people who are very muscular</li>
          <li>Does not provide a complete picture of your health</li>
        </ul>
      </ToolInfo>

      <ToolInfo title="How is BMI calculated?">
        <p>
          BMI is calculated by dividing your weight in kilograms by your height in meters
          squared: BMI = weight (kg) &divide; height (m)&sup2;. Measurements entered in feet,
          inches, or pounds are converted to metric units automatically.
        </p>
      </ToolInfo>

      <section aria-labelledby="bmi-faq-heading">
        <h2 id="bmi-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is a healthy BMI for adults?
            </summary>
            <div className="collapse-content text-sm text-muted">
              For most adults, a BMI between 18.5 and 24.9 is generally classified as a healthy
              weight. This range is a general guideline, and BMI is only one indicator of
              overall health.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does BMI differ for men and women?
            </summary>
            <div className="collapse-content text-sm text-muted">
              The standard adult BMI categories are generally the same for men and women. Body
              composition can still differ between individuals, which is one reason BMI works
              better as a general screening tool than as a precise measure.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is BMI accurate for athletes or muscular people?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Not always. BMI cannot tell the difference between muscle and fat, so it can
              overestimate body fat in people who are very muscular, which makes it less
              reliable for athletes and similar groups.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Can I use this BMI calculator for children?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. This calculator is intended for adults. Children and teenagers grow at
              different rates, so their BMI needs to be assessed with age and sex-specific
              charts rather than the adult categories used here.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What should I do if my BMI is outside the healthy range?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Consider talking to a qualified healthcare professional. They can look at your
              full health picture, not just your BMI, and give advice suited to you.
            </div>
          </details>
        </div>
      </section>

      <p className="text-sm text-muted">
        This calculator is for informational purposes only and is not medical advice. Always
        speak with a qualified healthcare provider about your health.
      </p>
    </ToolLayout>
  )
}

export default BmiCalculatorPage
