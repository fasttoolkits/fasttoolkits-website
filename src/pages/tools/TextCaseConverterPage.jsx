import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import useClipboardCopy from '../../hooks/useClipboardCopy'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolInfo from '../../components/tools/ToolInfo'
import CopyButton from '../../components/tools/CopyButton'
import { CASE_OPTIONS, convertCase } from '../../tools/textCase/textCaseConverter'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/text-case-converter')
const structuredData = buildToolStructuredData(tool)

function TextCaseConverterPage() {
  usePageTitle(
    'Text Case Converter: Change Text to Uppercase, Lowercase & More | FastToolKits',
    'Convert text to uppercase, lowercase, sentence case, title case, and more. Free text case converter that works directly in your browser.',
    { structuredData }
  )

  const [text, setText] = useState('')
  const [output, setOutput] = useState('')
  const { copiedKey, copy } = useClipboardCopy()

  const handleConvert = (caseKey) => {
    setOutput(convertCase(text, caseKey))
    trackToolUsage(tool)
  }

  const handleClear = () => {
    setText('')
    setOutput('')
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <label htmlFor="text-case-input" className="mb-2 block text-sm font-medium text-base-content">
          Your text
        </label>
        <p className="mb-2 text-xs text-muted">Type or paste your text, then choose a case below.</p>
        <textarea
          id="text-case-input"
          rows={8}
          className="textarea textarea-bordered w-full"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Start typing or paste your text here..."
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {CASE_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => handleConvert(option.key)}
              disabled={text.trim() === ''}
              className="btn btn-outline btn-primary btn-sm"
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <button type="button" onClick={handleClear} className="btn btn-ghost">
            Clear
          </button>
        </div>

        {output && (
          <div className="mt-6">
            <label htmlFor="text-case-output" className="mb-2 block text-sm font-medium text-base-content">
              Result
            </label>
            <textarea
              id="text-case-output"
              rows={8}
              readOnly
              className="textarea textarea-bordered w-full"
              value={output}
            />
            <div className="mt-3 flex justify-end">
              <CopyButton onCopy={() => copy(output, 'output')} isCopied={copiedKey === 'output'} />
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-muted">
        Your text is converted entirely in your browser. It is never sent to a server or saved
        anywhere.
      </p>

      <ToolInfo title="What a text case converter does">
        <p>
          A text case converter changes the capitalization of your text without changing the
          words themselves. It is useful when you need text formatted a certain way but do not
          want to retype it by hand.
        </p>
      </ToolInfo>

      <ToolInfo title="When to use each case">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium text-base-content">UPPERCASE:</span> headings, acronyms,
            or text meant to stand out.
          </li>
          <li>
            <span className="font-medium text-base-content">lowercase:</span> stylistic writing,
            usernames, or normalizing text for comparison.
          </li>
          <li>
            <span className="font-medium text-base-content">Sentence case:</span> capitalizes the
            first letter of each sentence, like standard writing.
          </li>
          <li>
            <span className="font-medium text-base-content">Title Case:</span> capitalizes the
            main words in a heading or title, keeping small words like &quot;and&quot; or
            &quot;the&quot; lowercase in the middle.
          </li>
          <li>
            <span className="font-medium text-base-content">Capitalized Case:</span> capitalizes
            the first letter of every word, including small words.
          </li>
          <li>
            <span className="font-medium text-base-content">aLtErNaTiNg CaSe:</span> switches
            between uppercase and lowercase letters, often used for emphasis or humor.
          </li>
        </ul>
      </ToolInfo>

      <section aria-labelledby="text-case-faq-heading">
        <h2 id="text-case-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is a text case converter?
            </summary>
            <div className="collapse-content text-sm text-muted">
              A tool that changes the capitalization of your text, such as switching it to
              uppercase, lowercase, sentence case, or title case, without changing the words.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is the difference between uppercase and lowercase?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Uppercase text uses all capital letters, like &quot;HELLO&quot;. Lowercase text uses
              no capital letters, like &quot;hello&quot;.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is sentence case?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Sentence case capitalizes only the first letter of each sentence, matching how
              normal sentences are written.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is title case?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Title case capitalizes the main words in a title or heading, while keeping short
              connecting words like &quot;of&quot; or &quot;and&quot; lowercase in the middle of
              the text.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does this tool save my text?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. All conversion happens in your browser. Your text is never sent to a server or
              saved anywhere.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default TextCaseConverterPage
