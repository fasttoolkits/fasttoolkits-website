import tools from '../../data/tools'
import ToolCard from '../ToolCard'

// Tool pages that exist today. Add a path here when its route is built so
// Related Tools can safely link to it without producing a 404.
const AVAILABLE_TOOL_PATHS = [
  '/bmi-calculator',
  '/age-calculator',
  '/tip-calculator',
  '/percentage-calculator',
  '/word-counter',
  '/password-generator',
  '/unit-converter',
  '/qr-code-generator',
  '/color-picker',
  '/loan-calculator',
  '/text-case-converter',
  '/json-formatter',
  '/image-compressor',
  '/pdf-merger',
]

function RelatedTools({ currentPath, category, limit = 3 }) {
  const candidates = tools.filter(
    (tool) => tool.path !== currentPath && AVAILABLE_TOOL_PATHS.includes(tool.path)
  )

  const related = [
    ...candidates.filter((tool) => tool.category === category),
    ...candidates.filter((tool) => tool.category !== category),
  ].slice(0, limit)

  if (related.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-lg font-semibold text-base-content">
        Related tools
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {related.map((tool) => (
          <ToolCard key={tool.path} tool={tool} />
        ))}
      </div>
    </section>
  )
}

export default RelatedTools
