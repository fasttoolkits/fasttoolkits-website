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
    `${tool.name} | FastToolKits`,
    'Free BMI calculator: enter your height and weight in metric or imperial units to instantly get your Body Mass Index and see which BMI category you fall into.',
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

      <p className="text-sm text-muted">
        BMI is a general screening measure, not a medical diagnosis. Talk to a healthcare
        provider for advice about your health.
      </p>

      <ToolInfo title="How BMI is calculated">
        <p>
          BMI is calculated by dividing your weight in kilograms by your height in meters
          squared: BMI = weight (kg) &divide; height (m)&sup2;. Measurements entered in feet,
          inches, or pounds are converted to metric units automatically.
        </p>
      </ToolInfo>

      <ToolInfo title="What your result means">
        <ul className="list-disc space-y-1 pl-5">
          <li>Underweight: below 18.5</li>
          <li>Normal weight: 18.5 to below 25</li>
          <li>Overweight: 25 to below 30</li>
          <li>Obesity: 30 or higher</li>
        </ul>
      </ToolInfo>

      <ToolInfo title="Limitations of BMI">
        <p>
          BMI does not account for muscle mass, bone density, age, or sex, so it can be
          misleading for athletes, older adults, and other groups. Use it as a general
          screening tool alongside other health measures, not as a diagnosis.
        </p>
      </ToolInfo>

      <section aria-labelledby="bmi-faq-heading">
        <h2 id="bmi-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is a lower BMI always healthier?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Not necessarily. A very low BMI can also indicate health risks. BMI is only a
              general screening measure, so unusually high or low results are worth discussing
              with a healthcare provider.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does BMI work the same way for everyone?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. BMI does not distinguish between muscle and fat, so it can overestimate body
              fat in muscular people and underestimate it in older adults who have lost muscle
              mass.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default BmiCalculatorPage
