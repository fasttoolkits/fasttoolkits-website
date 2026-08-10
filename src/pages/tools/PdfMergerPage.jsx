import { useRef, useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolInfo from '../../components/tools/ToolInfo'
import { MAX_FILES, MAX_FILE_SIZE_BYTES, formatFileSize, isPdfFile, mergePdfFiles } from '../../tools/pdfMerger/pdfMerger'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/pdf-merger')
const structuredData = buildToolStructuredData(tool)

let idCounter = 0
function nextId() {
  idCounter += 1
  return idCounter
}

function PdfMergerPage() {
  usePageTitle(
    'PDF Merger: Combine Multiple PDF Files into One | FastToolKits',
    'Combine multiple PDF files into one document directly in your browser. Reorder and merge PDFs, then download the combined file.',
    { structuredData }
  )

  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [isMerging, setIsMerging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFilesSelected = (event) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (selectedFiles.length === 0) return

    setResult(null)

    const invalid = selectedFiles.find((file) => !isPdfFile(file))
    if (invalid) {
      setError(`"${invalid.name}" is not a PDF file.`)
      return
    }

    const tooLarge = selectedFiles.find((file) => file.size > MAX_FILE_SIZE_BYTES)
    if (tooLarge) {
      setError(`"${tooLarge.name}" is larger than ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`)
      return
    }

    setEntries((prev) => {
      const combined = [...prev, ...selectedFiles.map((file) => ({ id: nextId(), file }))]
      if (combined.length > MAX_FILES) {
        setError(`You can merge up to ${MAX_FILES} files. Only the first ${MAX_FILES} were kept.`)
        return combined.slice(0, MAX_FILES)
      }
      setError('')
      return combined
    })
  }

  const handleRemove = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    setResult(null)
  }

  const handleMoveUp = (index) => {
    if (index === 0) return
    setEntries((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
    setResult(null)
  }

  const handleMoveDown = (index) => {
    setEntries((prev) => {
      if (index === prev.length - 1) return prev
      const next = [...prev]
      ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
      return next
    })
    setResult(null)
  }

  const handleMerge = async () => {
    setIsMerging(true)
    const merged = await mergePdfFiles(entries.map((entry) => entry.file))
    setIsMerging(false)

    if (merged.error) {
      setError(merged.error)
      setResult(null)
      return
    }

    setError('')
    setResult(merged)
    trackToolUsage(tool)
  }

  const handleReset = () => {
    setEntries([])
    setError('')
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <label htmlFor="pdf-merger-files" className="mb-2 block text-sm font-medium text-base-content">
          Choose PDF files
        </label>
        <p className="mb-2 text-xs text-muted">
          Select two or more PDF files, up to {MAX_FILES} files total.
        </p>
        <input
          id="pdf-merger-files"
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={handleFilesSelected}
          className="file-input file-input-bordered w-full"
        />

        {entries.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {entries.map((entry, index) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-base-content">
                    {index + 1}. {entry.file.name}
                  </p>
                  <p className="text-xs text-muted">{formatFileSize(entry.file.size)}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    aria-label={`Move ${entry.file.name} up`}
                    className="btn btn-ghost btn-sm"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === entries.length - 1}
                    aria-label={`Move ${entry.file.name} down`}
                    className="btn btn-ghost btn-sm"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(entry.id)}
                    aria-label={`Remove ${entry.file.name}`}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleMerge}
            disabled={entries.length < 2 || isMerging}
            className="btn btn-primary"
          >
            {isMerging ? 'Merging...' : 'Merge PDFs'}
          </button>
          <button type="button" onClick={handleReset} className="btn btn-ghost">
            Reset
          </button>
        </div>

        {result && (
          <div role="status" aria-live="polite" className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-muted">
              Merged PDF ready: {result.pageCount} pages, {formatFileSize(result.size)}
            </p>
            <a href={result.url} download="merged.pdf" className="btn btn-outline btn-primary">
              Download merged PDF
            </a>
          </div>
        )}
      </div>

      <p className="text-sm text-muted">
        Your PDF files are merged entirely in your browser. They are never uploaded to
        FastToolKits servers.
      </p>

      <ToolInfo title="What is a PDF merger?">
        <p>
          A PDF merger combines two or more separate PDF files into a single document, keeping
          the pages from each file in the order you choose.
        </p>
      </ToolInfo>

      <ToolInfo title="How to merge PDF files">
        <p>
          Choose the PDF files you want to combine, arrange them in the order you want using the
          Up and Down buttons, then select Merge PDFs. When merging finishes, download the
          combined file.
        </p>
      </ToolInfo>

      <ToolInfo title="How to reorder PDF files before merging">
        <p>
          Use the Up and Down buttons next to each file to change its position in the list. Pages
          from each file appear in the merged PDF in the same order the files are listed.
        </p>
      </ToolInfo>

      <ToolInfo title="What happens to the original files?">
        <p>
          Your original files are not changed. The merger creates a new, separate PDF that
          contains the pages from each file you selected.
        </p>
      </ToolInfo>

      <section aria-labelledby="pdf-merger-faq-heading">
        <h2 id="pdf-merger-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How do I merge multiple PDF files?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Select two or more PDF files, check the order in the list, then select Merge PDFs to
              create one combined file you can download.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Can I change the order of PDFs before merging?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Yes. Use the Up and Down buttons next to each file to move it earlier or later in
              the list before merging.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Are my PDF files uploaded?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. Your files are merged entirely in your browser and are never uploaded to
              FastToolKits servers.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does merging reduce PDF quality?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. Merging copies the existing pages into a new file without re-rendering or
              compressing their content.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How many PDF files can I merge?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Up to {MAX_FILES} files at once, each up to {formatFileSize(MAX_FILE_SIZE_BYTES)}.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default PdfMergerPage
