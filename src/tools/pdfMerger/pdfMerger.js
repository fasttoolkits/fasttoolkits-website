export const MAX_FILES = 20
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function isPdfFile(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export async function mergePdfFiles(files) {
  if (!files || files.length === 0) {
    return { error: 'Please choose at least one PDF file.' }
  }

  if (files.length < 2) {
    return { error: 'Please choose at least two PDF files to merge.' }
  }

  if (files.length > MAX_FILES) {
    return { error: `Please choose ${MAX_FILES} files or fewer.` }
  }

  const { PDFDocument } = await import('pdf-lib')

  try {
    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      let bytes
      try {
        bytes = await file.arrayBuffer()
      } catch {
        return { error: `"${file.name}" could not be read.` }
      }

      let sourcePdf
      try {
        sourcePdf = await PDFDocument.load(bytes)
      } catch {
        return { error: `"${file.name}" could not be read. It may not be a valid PDF.` }
      }

      const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedBytes = await mergedPdf.save()
    const blob = new Blob([mergedBytes], { type: 'application/pdf' })

    return {
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      pageCount: mergedPdf.getPageCount(),
    }
  } catch {
    return { error: 'The PDF files could not be merged. Please check that each file is a valid PDF.' }
  }
}
