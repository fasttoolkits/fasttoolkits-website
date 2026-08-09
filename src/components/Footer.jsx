import { Link } from 'react-router'

const FOOTER_LINKS = [
  { label: 'Tools', to: '/#tools' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
]

function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-md text-sm font-medium text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="mt-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} FastToolKits. Fast, free tools for everyday life.
        </p>
        <p className="mt-1 text-center text-sm text-muted">
          Owned and maintained by{' '}
          <a
            href="https://www.thecraftaxis.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            The CraftAxis
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
