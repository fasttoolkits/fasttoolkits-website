import { Link } from 'react-router'

function ToolHeader({ tool }) {
  return (
    <header>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted">
        <Link
          to="/"
          className="rounded-md hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-base-content">
          {tool.name}
        </span>
      </nav>

      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        {tool.category}
      </span>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">{tool.name}</h1>
      <p className="mt-2 max-w-xl text-base text-muted">{tool.description}</p>
    </header>
  )
}

export default ToolHeader
