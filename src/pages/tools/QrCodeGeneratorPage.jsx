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
    'QR Code Generator: Turn Text or a Link into a QR Code | FastToolKits',
    'Create a scannable QR code from any text or link, right in your browser. Download it as an image to print or share. Free, no signup, nothing sent to a server.',
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

      <ToolInfo title="What is a QR code?">
        <p>
          A QR code is a square pattern of black and white squares that stores text, such as a
          website link, a message, or contact details. Pointing a camera at it decodes that text
          almost instantly, which is faster than typing a long link by hand.
        </p>
      </ToolInfo>

      <ToolInfo title="How to scan a QR code">
        <p>
          Most modern phone cameras can scan a QR code without an extra app. Open your camera app,
          point it at the code, and a notification or on-screen link should appear that you can
          tap to open. If your camera doesn&apos;t support this, a free QR scanner app will work
          too.
        </p>
      </ToolInfo>

      <ToolInfo title="Where QR codes are commonly used">
        <ul className="list-disc space-y-1 pl-5">
          <li>Linking to a website, menu, or contact page without typing a URL.</li>
          <li>Sharing Wi-Fi details or event information.</li>
          <li>Printed materials like posters, packaging, and business cards.</li>
          <li>Boarding passes and tickets.</li>
        </ul>
      </ToolInfo>

      <ToolInfo title="Staying safe with QR codes">
        <p>
          Before scanning an unfamiliar QR code, especially one you find in public, check where it
          leads before you continue. Many phones show a preview of the link before opening it.
          Avoid entering personal information, passwords, or payment details on a page you
          don&apos;t recognize or trust.
        </p>
      </ToolInfo>

      <section aria-labelledby="qr-faq-heading">
        <h2 id="qr-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is my text or link sent to a server?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. The QR code is generated entirely in your browser. What you type is never sent
              to FastToolKits servers or stored anywhere.
            </div>
          </details>

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

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is it safe to scan any QR code I see?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Treat an unfamiliar QR code the way you would an unfamiliar link. Check the address
              your phone shows before opening it, and avoid entering sensitive information on a
              page you don&apos;t trust.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is there a limit to how much text I can encode?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Yes, up to {MAX_TEXT_LENGTH} characters. Longer text creates a denser QR code, which
              can be harder for some cameras to scan.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default QrCodeGeneratorPage
