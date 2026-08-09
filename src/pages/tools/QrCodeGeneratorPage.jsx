import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolInfo from '../../components/tools/ToolInfo'
import { MAX_TEXT_LENGTH, generateQrCodeDataUrl } from '../../tools/qr/qrCodeGenerator'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/qr-code-generator')
const structuredData = buildToolStructuredData(tool)

function QrCodeGeneratorPage() {
  usePageTitle(
    'QR Code Generator | FastToolKits',
    'Free QR code generator: turn any text or link into a scannable QR code right in your browser, then download it as an image to share or print.',
    { structuredData }
  )

  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleTextChange = (value) => {
    setText(value)
    setError('')
    setResult(null)
  }

  const handleGenerate = async (event) => {
    event.preventDefault()
    setIsGenerating(true)
    const { dataUrl, text: encodedText, error: generationError } = await generateQrCodeDataUrl(text)
    setIsGenerating(false)

    if (generationError) {
      setError(generationError)
      setResult(null)
      return
    }

    setError('')
    setResult({ dataUrl, text: encodedText })
    trackToolUsage(tool)
  }

  const handleReset = () => {
    setText('')
    setError('')
    setResult(null)
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <form onSubmit={handleGenerate} noValidate className="flex flex-col gap-6">
          <div>
            <label htmlFor="qr-text" className="mb-1 block text-sm font-medium text-base-content">
              Text or link
            </label>
            <p className="mb-2 text-xs text-muted">
              Enter a website link, a message, or any text up to {MAX_TEXT_LENGTH} characters.
            </p>
            <textarea
              id="qr-text"
              rows={3}
              className="textarea textarea-bordered w-full"
              value={text}
              onChange={(event) => handleTextChange(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'qr-text-error' : undefined}
              placeholder="https://example.com"
            />
            {error && (
              <p id="qr-text-error" role="alert" className="mt-2 text-sm text-error">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary" disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate QR code'}
            </button>
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div role="status" aria-live="polite" className="mt-6 flex flex-col items-center gap-4">
            <div className="min-w-0 max-w-full rounded-lg border border-base-300 bg-base-100 p-4">
              <img
                src={result.dataUrl}
                alt={`QR code for: ${result.text}`}
                className="h-auto w-full max-w-[280px]"
              />
            </div>
            <p className="max-w-sm break-words text-center text-sm text-muted">{result.text}</p>
            <a href={result.dataUrl} download="qrcode.png" className="btn btn-outline btn-primary">
              Download QR code
            </a>
          </div>
        )}
      </div>

      <ToolInfo title="How this works">
        <p>
          Your QR code is created entirely in your browser and encodes exactly what you type.
          Nothing is sent to a server. Scan it with any phone camera or QR scanner app to check
          it before sharing.
        </p>
      </ToolInfo>

      <section aria-labelledby="qr-faq-heading">
        <h2 id="qr-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does the QR code expire?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. The QR code is a picture of the exact text you entered, so it works for as long
              as you keep the image and the content it points to still exists.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Why won&apos;t my QR code scan?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Make sure the full image is visible and not blurry, and that your link starts with
              https:// if you want it to open directly in a browser.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default QrCodeGeneratorPage
