import { Link } from 'react-router'

function Navbar() {
  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link
          to="/"
          className="rounded-md text-lg font-bold tracking-tight text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Fast<span className="text-primary">ToolKits</span>
        </Link>

        <nav aria-label="Primary">
          <Link
            to="/#tools"
            className="rounded-md px-3 py-2 text-sm font-medium text-base-content transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            All Tools
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
