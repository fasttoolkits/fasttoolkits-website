import ToolHeader from '../components/tools/ToolHeader'
import RelatedTools from '../components/tools/RelatedTools'

function ToolLayout({ tool, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <ToolHeader tool={tool} />

      <div className="mt-8 flex flex-col gap-10">{children}</div>

      <div className="mt-12">
        <RelatedTools currentPath={tool.path} category={tool.category} />
      </div>
    </div>
  )
}

export default ToolLayout
