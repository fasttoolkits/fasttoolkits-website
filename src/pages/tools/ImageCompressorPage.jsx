import { useRef, useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolInfo from '../../components/tools/ToolInfo'
import PillToggle from '../../components/tools/PillToggle'
import {
  OUTPUT_FORMATS,
  DEFAULT_QUALITY,
  formatFileSize,
  getOutputExtension,
  compressImage,
} from '../../tools/imageCompressor/imageCompressor'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/image-compressor')
const structuredData = buildToolStructuredData(tool)

function ImageCompressorPage() {
  usePageTitle(
    'Image Compressor: Reduce Image File Size Online | FastToolKits',
    'Compress images directly in your browser and reduce file size while keeping good image quality. Free image compressor with no signup.',
    { structuredData }
  )

  const [file, setFile] = useState(null)
  const [outputType, setOutputType] = useState('image/jpeg')
  const [quality, setQuality] = useState(DEFAULT_QUALITY)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null
    setFile(selected)
    setResult(null)
    setError('')
  }

  const handleCompress = async () => {
    if (!file) {
      setError('Please choose an image file first.')
      return
    }

    setIsCompressing(true)
    const compressed = await compressImage(file, { quality, outputType })
    setIsCompressing(false)

    if (compressed.error) {
      setError(compressed.error)
      setResult(null)
      return
    }

    setError('')
    setResult(compressed)
    trackToolUsage(tool)
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError('')
    setQuality(DEFAULT_QUALITY)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const reduction =
    result && result.originalSize > 0
      ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
      : null
  const isLarger = reduction !== null && reduction < 0

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <label htmlFor="image-compressor-file" className="mb-2 block text-sm font-medium text-base-content">
          Choose an image
        </label>
        <p className="mb-2 text-xs text-muted">Supported formats: JPEG, PNG, and WebP. Max file size 20 MB.</p>
        <input
          id="image-compressor-file"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
        />

        {file && (
          <p className="mt-2 text-sm text-muted">
            Selected: {file.name} ({formatFileSize(file.size)})
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <span className="mb-2 block text-sm font-medium text-base-content">Output format</span>
            <PillToggle
              label="Output format"
              options={OUTPUT_FORMATS.map((format) => ({ value: format.value, label: format.label }))}
              value={outputType}
              onChange={setOutputType}
            />
          </div>

          {outputType !== 'image/png' && (
            <div>
              <label htmlFor="image-compressor-quality" className="mb-2 block text-sm font-medium text-base-content">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                id="image-compressor-quality"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="range range-primary"
              />
              <p className="mt-1 text-xs text-muted">Lower quality means a smaller file size.</p>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleCompress} disabled={!file || isCompressing} className="btn btn-primary">
            {isCompressing ? 'Compressing...' : 'Compress image'}
          </button>
          <button type="button" onClick={handleReset} className="btn btn-ghost">
            Reset
          </button>
        </div>

        {result && (
          <div role="status" aria-live="polite" className="mt-6 flex flex-col items-center gap-4">
            <img
              src={result.url}
              alt="Compressed preview"
              className="h-auto max-h-80 w-auto max-w-full rounded-lg border border-base-300"
            />

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-base-300 bg-base-100 p-4 text-center">
                <p className="text-sm font-medium text-muted">Original size</p>
                <p className="mt-1 text-lg font-bold text-base-content">{formatFileSize(result.originalSize)}</p>
              </div>
              <div className="rounded-lg border border-base-300 bg-base-100 p-4 text-center">
                <p className="text-sm font-medium text-muted">Compressed size</p>
                <p className="mt-1 text-lg font-bold text-base-content">{formatFileSize(result.compressedSize)}</p>
              </div>
              <div className="rounded-lg border border-base-300 bg-base-100 p-4 text-center">
                <p className="text-sm font-medium text-muted">{isLarger ? 'Size change' : 'Size reduction'}</p>
                <p className="mt-1 text-lg font-bold text-base-content">
                  {reduction !== null ? `${isLarger ? Math.abs(reduction) : reduction}%` : 'N/A'}
                </p>
              </div>
            </div>

            {isLarger && (
              <p className="max-w-sm text-center text-sm text-muted">
                This file got larger after compression. This can happen with small or already
                optimized images. Try a different output format or a higher quality setting.
              </p>
            )}

            <a
              href={result.url}
              download={`compressed.${getOutputExtension(outputType)}`}
              className="btn btn-outline btn-primary"
            >
              Download compressed image
            </a>
          </div>
        )}
      </div>

      <p className="text-sm text-muted">
        Your image is compressed entirely in your browser using your device&apos;s processing
        power. It is never uploaded to FastToolKits servers.
      </p>

      <ToolInfo title="What does image compression do?">
        <p>
          Image compression reduces a file&apos;s size by re-encoding it, so it takes up less
          storage space and loads faster on a website or in an app.
        </p>
      </ToolInfo>

      <ToolInfo title="Lossy vs lossless compression">
        <p>
          JPEG and WebP use lossy compression, which reduces file size by removing some image
          detail. Lower quality settings remove more detail. PNG uses lossless compression, so it
          keeps every pixel but usually results in a larger file.
        </p>
      </ToolInfo>

      <ToolInfo title="When should you compress an image?">
        <ul className="list-disc space-y-1 pl-5">
          <li>Before uploading photos to a website to help pages load faster.</li>
          <li>Before attaching images to an email with a file size limit.</li>
          <li>When storage space is limited on a device or server.</li>
        </ul>
      </ToolInfo>

      <ToolInfo title="Image quality vs file size">
        <p>
          There is a tradeoff between quality and file size. A higher quality setting keeps more
          detail but produces a larger file. A lower quality setting produces a smaller file but
          may show visible compression artifacts, especially in photos with fine detail.
        </p>
      </ToolInfo>

      <section aria-labelledby="image-compressor-faq-heading">
        <h2 id="image-compressor-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How does image compression work?
            </summary>
            <div className="collapse-content text-sm text-muted">
              This tool redraws your image on a canvas in your browser and re-encodes it at the
              quality and format you choose, which typically reduces the file size.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Does compressing an image reduce quality?
            </summary>
            <div className="collapse-content text-sm text-muted">
              For JPEG and WebP, lower quality settings can reduce visible detail. PNG stays
              lossless, so no detail is lost, but the file size reduction is usually smaller.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Which image formats are supported?
            </summary>
            <div className="collapse-content text-sm text-muted">
              JPEG, PNG, and WebP, for both the file you upload and the format you compress it to.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Are my images uploaded to a server?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. Compression happens entirely in your browser using your device&apos;s
              processing power. Your image is never uploaded to FastToolKits servers.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How much can an image be compressed?
            </summary>
            <div className="collapse-content text-sm text-muted">
              It depends on the image itself, its original format, and the quality setting you
              choose. Photos with lots of detail generally compress less than simpler images.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default ImageCompressorPage
