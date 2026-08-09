import { useEffect, useMemo, useRef, useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import { getTextStats } from '../../tools/wordCounter/wordCounter'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const TRACK_DEBOUNCE_MS = 2000

const tool = tools.find((item) => item.path === '/word-counter')
const structuredData = buildToolStructuredData(tool)

function WordCounterPage() {
  usePageTitle(
    'Word Counter | FastToolKits',
    'Free word counter: paste or type your text to instantly count words, characters, sentences, paragraphs, and estimated reading time.',
    { structuredData }
  )

  const [text, setText] = useState('')
  const hasTrackedRef = useRef(false)

  const stats = useMemo(() => getTextStats(text), [text])

  useEffect(() => {
    if (text.trim() === '') {
      hasTrackedRef.current = false
      return undefined
    }

    if (hasTrackedRef.current) {
      return undefined
    }

    const timer = setTimeout(() => {
      trackToolUsage(tool)
      hasTrackedRef.current = true
    }, TRACK_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [text])

  const handleClear = () => {
    setText('')
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <label htmlFor="word-counter-text" className="mb-2 block text-sm font-medium text-base-content">
          Your text
        </label>
        <p className="mb-2 text-xs text-muted">Type or paste your text below. Counts update as you type.</p>
        <textarea
          id="word-counter-text"
          rows={10}
          className="textarea textarea-bordered w-full"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Start typing or paste your text here..."
        />

        <div className="mt-4">
          <button type="button" onClick={handleClear} className="btn btn-ghost">
            Clear
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <ToolResult label="Words" value={stats.words} />
          <ToolResult label="Characters" value={stats.characters} />
          <ToolResult label="Characters (no spaces)" value={stats.charactersNoSpaces} />
          <ToolResult label="Sentences" value={stats.sentences} />
          <ToolResult label="Paragraphs" value={stats.paragraphs} />
          <ToolResult label="Reading time" value={stats.readingTime} />
        </div>
      </div>

      <ToolInfo title="How counting works">
        <ul className="list-disc space-y-1 pl-5">
          <li>Words are groups of characters separated by spaces or line breaks.</li>
          <li>Sentences are counted by looking for periods, question marks, and exclamation marks.</li>
          <li>Paragraphs are blocks of text separated by a blank line.</li>
          <li>Reading time is estimated at 200 words per minute.</li>
        </ul>
      </ToolInfo>

      <section aria-labelledby="word-counter-faq-heading">
        <h2 id="word-counter-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does this tool save or send my text anywhere?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. All counting happens in your browser. Your text is never sent to a server.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Why is my character count different from what another tool shows?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Some tools count spaces and line breaks differently. This tool shows both the total
              character count and the count without spaces, so you can compare either number.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How is reading time calculated?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Reading time is estimated using an average reading speed of 200 words per minute.
              Your actual reading time may be faster or slower.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default WordCounterPage
