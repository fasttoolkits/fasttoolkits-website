import { useMemo, useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import useClipboardCopy from '../../hooks/useClipboardCopy'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import CopyButton from '../../components/tools/CopyButton'
import {
  DEFAULT_COLOR,
  validateHex,
  hexToRgb,
  rgbToHsl,
  formatRgbString,
  formatHslString,
  getShades,
  getComplementary,
  getAnalogous,
} from '../../tools/color/colorPicker'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/color-picker')
const structuredData = buildToolStructuredData(tool)

function ColorSwatch({ hex, label, isCopied, onCopy }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy ${label} color ${hex}`}
      className="flex flex-col items-center gap-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span
        className="h-12 w-12 rounded-md border border-base-300 sm:h-14 sm:w-14"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <span className="text-xs text-muted">{isCopied ? 'Copied' : hex}</span>
    </button>
  )
}

function ColorPickerPage() {
  usePageTitle(
    'Color Picker: Convert HEX, RGB, and HSL Color Values | FastToolKits',
    'Pick any color and instantly see its HEX, RGB, and HSL values, plus matching shades, a complementary color, and analogous colors. Copy any value with one click.',
    { structuredData }
  )

  const [hex, setHex] = useState(DEFAULT_COLOR)
  const [hexText, setHexText] = useState(DEFAULT_COLOR)
  const [hexError, setHexError] = useState('')
  const { copiedKey, copy } = useClipboardCopy()

  const handleCopy = (value, key) => {
    copy(value, key)
    trackToolUsage(tool)
  }

  const handleColorInputChange = (value) => {
    setHex(value)
    setHexText(value)
    setHexError('')
  }

  const handleHexTextChange = (value) => {
    setHexText(value)
    const { hex: validHex, error } = validateHex(value)
    if (error) {
      setHexError(error)
      return
    }
    setHexError('')
    setHex(validHex)
  }

  const handleReset = () => {
    setHex(DEFAULT_COLOR)
    setHexText(DEFAULT_COLOR)
    setHexError('')
  }

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb])
  const rgbString = useMemo(() => formatRgbString(rgb), [rgb])
  const hslString = useMemo(() => formatHslString(hsl), [hsl])
  const shades = useMemo(() => getShades(hex), [hex])
  const complementary = useMemo(() => getComplementary(hex), [hex])
  const analogous = useMemo(() => getAnalogous(hex), [hex])

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div>
            <label htmlFor="color-input" className="mb-2 block text-sm font-medium text-base-content">
              Pick a color
            </label>
            <input
              id="color-input"
              type="color"
              value={hex}
              onChange={(event) => handleColorInputChange(event.target.value)}
              className="h-12 w-20 cursor-pointer rounded-md border border-base-300 bg-base-100 p-1"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="color-hex-text" className="mb-2 block text-sm font-medium text-base-content">
              Hex code
            </label>
            <input
              id="color-hex-text"
              type="text"
              className="input input-bordered w-full font-mono"
              value={hexText}
              onChange={(event) => handleHexTextChange(event.target.value)}
              aria-invalid={Boolean(hexError)}
              aria-describedby={hexError ? 'color-hex-error' : undefined}
              placeholder="#2563EB"
            />
            {hexError && (
              <p id="color-hex-error" role="alert" className="mt-2 text-sm text-error">
                {hexError}
              </p>
            )}
          </div>

          <button type="button" onClick={handleReset} className="btn btn-ghost">
            Reset
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <ToolResult label="Hex" value={hex.toUpperCase()} />
          <div className="flex justify-center">
            <CopyButton onCopy={() => handleCopy(hex.toUpperCase(), 'hex')} isCopied={copiedKey === 'hex'} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
              role="status"
              aria-live="polite"
              className="flex items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted">RGB</p>
                <p className="mt-1 break-words font-mono text-base text-base-content">{rgbString}</p>
              </div>
              <CopyButton onCopy={() => handleCopy(rgbString, 'rgb')} isCopied={copiedKey === 'rgb'} />
            </div>

            <div
              role="status"
              aria-live="polite"
              className="flex items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted">HSL</p>
                <p className="mt-1 break-words font-mono text-base text-base-content">{hslString}</p>
              </div>
              <CopyButton onCopy={() => handleCopy(hslString, 'hsl')} isCopied={copiedKey === 'hsl'} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-base-content">Lighter shades</h3>
            <div className="flex flex-wrap gap-4">
              {shades.lighter.map((shadeHex) => (
                <ColorSwatch
                  key={shadeHex}
                  hex={shadeHex}
                  label="lighter shade"
                  isCopied={copiedKey === shadeHex}
                  onCopy={() => handleCopy(shadeHex, shadeHex)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-base-content">Darker shades</h3>
            <div className="flex flex-wrap gap-4">
              {shades.darker.map((shadeHex) => (
                <ColorSwatch
                  key={shadeHex}
                  hex={shadeHex}
                  label="darker shade"
                  isCopied={copiedKey === shadeHex}
                  onCopy={() => handleCopy(shadeHex, shadeHex)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-base-content">Complementary color</h3>
            <div className="flex flex-wrap gap-4">
              <ColorSwatch
                hex={complementary}
                label="complementary color"
                isCopied={copiedKey === complementary}
                onCopy={() => handleCopy(complementary, complementary)}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-base-content">Analogous colors</h3>
            <div className="flex flex-wrap gap-4">
              <ColorSwatch
                hex={analogous[0]}
                label="analogous color"
                isCopied={copiedKey === analogous[0]}
                onCopy={() => handleCopy(analogous[0], analogous[0])}
              />
              <ColorSwatch
                hex={analogous[1]}
                label="analogous color"
                isCopied={copiedKey === analogous[1]}
                onCopy={() => handleCopy(analogous[1], analogous[1])}
              />
            </div>
          </div>
        </div>
      </div>

      <ToolInfo title="How this works">
        <p>
          Pick a color using the color picker or type a hex code directly. Tap any shade or
          matching color below to copy its hex code to your clipboard.
        </p>
      </ToolInfo>

      <ToolInfo title="HEX, RGB, and HSL, explained">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-base-content">HEX:</span> a 6-character code like
            #2563EB, made of three pairs of characters for red, green, and blue.
          </li>
          <li>
            <span className="font-medium text-base-content">RGB:</span> the same red, green, and
            blue amounts written as numbers from 0 to 255, like rgb(37, 99, 235).
          </li>
          <li>
            <span className="font-medium text-base-content">HSL:</span> hue, saturation, and
            lightness. It describes a color using an angle on a color wheel plus how vivid and how
            bright it is.
          </li>
        </ul>
      </ToolInfo>

      <ToolInfo title="What complementary and analogous mean">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-base-content">Complementary:</span> the color
            directly opposite yours, useful for high-contrast accents.
          </li>
          <li>
            <span className="font-medium text-base-content">Analogous:</span> colors next to
            yours, useful for a palette that feels harmonious.
          </li>
        </ul>
      </ToolInfo>

      <ToolInfo title="Using a color value in CSS or design software">
        <p>
          Copy any HEX, RGB, or HSL value from this page and paste it directly into a CSS
          property, like <code className="rounded bg-base-200 px-1 py-0.5">color: #2563EB;</code>,
          or into the color field of most design tools. Keep in mind that sufficient contrast
          between text and background colors matters for readability.
        </p>
      </ToolInfo>

      <section aria-labelledby="color-picker-faq-heading">
        <h2 id="color-picker-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is a HEX color code?
            </summary>
            <div className="collapse-content text-sm text-muted">
              A HEX code represents a color using six characters after a #, like #2563EB. The
              first two characters set the red amount, the next two set green, and the last two
              set blue.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is the difference between HEX and RGB?
            </summary>
            <div className="collapse-content text-sm text-muted">
              They describe the same color in different formats. HEX uses a 6-character code, and
              RGB writes the same red, green, and blue amounts as three numbers between 0 and 255.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is HSL?
            </summary>
            <div className="collapse-content text-sm text-muted">
              HSL stands for hue, saturation, and lightness. It describes a color using an angle
              on a color wheel plus how vivid and how bright it is.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How do I use a HEX color in CSS?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Copy the hex code and use it anywhere a CSS color is expected, for example{' '}
              <code className="rounded bg-base-200 px-1 py-0.5">background-color: #2563EB;</code>.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Can I type a 3-character hex code, like #F00?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Yes. Short hex codes like #F00 are automatically expanded to the full 6-character
              version.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default ColorPickerPage
