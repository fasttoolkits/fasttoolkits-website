import { Link } from 'react-router'

function ToolCard({ tool }) {
  return (
    <Link
      to={tool.path}
      className="group flex flex-col gap-2 rounded-lg border border-base-300 bg-base-100 p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        {tool.category}
      </span>

      <h3 className="text-base font-semibold text-base-content">{tool.name}</h3>

      <p className="text-sm leading-relaxed text-muted">{tool.description}</p>

      <span className="mt-1 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Open tool
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </Link>
  )
}

export default ToolCard
