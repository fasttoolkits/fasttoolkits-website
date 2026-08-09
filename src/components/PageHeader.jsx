import { Link } from 'react-router'

function PageHeader({ title, description }) {
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
          {title}
        </span>
      </nav>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-xl text-base text-muted">{description}</p>}
    </header>
  )
}

export default PageHeader
