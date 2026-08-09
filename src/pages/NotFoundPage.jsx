import { Link } from 'react-router'
import usePageTitle from '../hooks/usePageTitle'

function NotFoundPage() {
  usePageTitle('Page Not Found | FastToolKits')

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-base-content">404: Page Not Found</h1>
      <p className="text-muted">
        The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been built yet.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
