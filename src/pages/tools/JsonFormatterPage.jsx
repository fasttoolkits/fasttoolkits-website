import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import useClipboardCopy from '../../hooks/useClipboardCopy'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolInfo from '../../components/tools/ToolInfo'
import CopyButton from '../../components/tools/CopyButton'
import PillToggle from '../../components/tools/PillToggle'
import { INDENT_OPTIONS, DEFAULT_INDENT, formatJson, minifyJson, validateJson } from '../../tools/jsonFormatter/jsonFormatter'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/json-formatter')
const structuredData = buildToolStructuredData(tool)

function JsonFormatterPage() {
  usePageTitle(
    'JSON Formatter & Validator: Format and Validate JSON | FastToolKits',
    'Format, validate, and beautify JSON directly in your browser. Quickly find JSON syntax errors and copy clean, readable JSON.',
    { structuredData }
  )

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(DEFAULT_INDENT)
  const [error, setError] = useState('')
  const [validMessage, setValidMessage] = useState('')
  const { copiedKey, copy } = useClipboardCopy()

  const handleInputChange = (value) => {
    setInput(value)
    setOutput('')
    setError('')
    setValidMessage('')
  }

  const handleFormat = () => {
    const { result, error: formatError } = formatJson(input, indent)
    setValidMessage('')
    if (formatError) {
      setError(formatError)
      setOutput('')
      return
    }
    setError('')
    setOutput(result)
    trackToolUsage(tool)
  }

  const handleMinify = () => {
    const { result, error: minifyError } = minifyJson(input)
    setValidMessage('')
    if (minifyError) {
      setError(minifyError)
      setOutput('')
      return
    }
    setError('')
    setOutput(result)
    trackToolUsage(tool)
  }

  const handleValidate = () => {
    const { valid, error: validationError } = validateJson(input)
    setOutput('')
    trackToolUsage(tool)
    if (!valid) {
      setError(validationError)
      setValidMessage('')
      return
    }
    setError('')
    setValidMessage('This is valid JSON.')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setValidMessage('')
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <label htmlFor="json-input" className="mb-2 block text-sm font-medium text-base-content">
          Your JSON
        </label>
        <p className="mb-2 text-xs text-muted">Paste JSON below, then format, minify, or validate it.</p>
        <textarea
          id="json-input"
          rows={10}
          spellCheck={false}
          className="textarea textarea-bordered w-full font-mono text-sm"
          value={input}
          onChange={(event) => handleInputChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'json-error' : undefined}
          placeholder='{"name": "example", "active": true}'
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PillToggle label="Indentation" options={INDENT_OPTIONS} value={indent} onChange={setIndent} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={handleFormat} className="btn btn-primary">
            Format
          </button>
          <button type="button" onClick={handleMinify} className="btn btn-outline btn-primary">
            Minify
          </button>
          <button type="button" onClick={handleValidate} className="btn btn-outline btn-primary">
            Validate
          </button>
          <button type="button" onClick={handleClear} className="btn btn-ghost">
            Clear
          </button>
        </div>

        {error && (
          <p id="json-error" role="alert" className="mt-4 text-sm text-error">
            {error}
          </p>
        )}

        {validMessage && (
          <p role="status" className="mt-4 text-sm font-medium text-success">
            {validMessage}
          </p>
        )}

        {output && (
          <div className="mt-6">
            <label htmlFor="json-output" className="mb-2 block text-sm font-medium text-base-content">
              Result
            </label>
            <textarea
              id="json-output"
              rows={10}
              readOnly
              spellCheck={false}
              className="textarea textarea-bordered w-full font-mono text-sm"
              value={output}
            />
            <div className="mt-3 flex justify-end">
              <CopyButton onCopy={() => copy(output, 'output')} isCopied={copiedKey === 'output'} />
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-muted">
        Your JSON is processed entirely in your browser. It is never sent to a server or saved
        anywhere.
      </p>

      <ToolInfo title="What is JSON?">
        <p>
          JSON (JavaScript Object Notation) is a text format for storing and exchanging data. It
          is widely used by APIs, configuration files, and web applications because it is easy
          for both people and computers to read.
        </p>
      </ToolInfo>

      <ToolInfo title="Why format JSON?">
        <p>
          JSON from an API or log file is often returned as one long line, which is hard to read.
          Formatting adds line breaks and indentation so you can see the structure clearly and
          find the value you need.
        </p>
      </ToolInfo>

      <ToolInfo title="How to validate JSON">
        <p>
          Paste your JSON and select Validate. If it is valid, you will see a confirmation
          message. If it is not, an error message will point to roughly where the problem is.
        </p>
      </ToolInfo>

      <ToolInfo title="Common JSON syntax errors">
        <ul className="list-disc space-y-1 pl-5">
          <li>A trailing comma after the last item in an object or array.</li>
          <li>Using single quotes instead of double quotes around keys and string values.</li>
          <li>A missing comma between two items.</li>
          <li>An unclosed bracket, brace, or quotation mark.</li>
        </ul>
      </ToolInfo>

      <section aria-labelledby="json-faq-heading">
        <h2 id="json-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is JSON?
            </summary>
            <div className="collapse-content text-sm text-muted">
              JSON is a lightweight text format used to store and exchange data, built from
              key-value pairs and lists.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How do I format JSON?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Paste your JSON into the box above, choose 2 spaces, 4 spaces, or a tab for
              indentation, then select Format.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How do I know if JSON is valid?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Select Validate. You will see a message confirming your JSON is valid, or an error
              describing what is wrong and roughly where it is.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Why is my JSON invalid?
            </summary>
            <div className="collapse-content text-sm text-muted">
              The most common causes are a trailing comma, single quotes instead of double quotes,
              a missing comma, or an unclosed bracket or brace.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does this JSON formatter send my data to a server?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. Formatting, minifying, and validating all happen in your browser. Your JSON is
              never sent to a server or saved anywhere.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default JsonFormatterPage
