import { Link } from 'react-router'
import usePageTitle from '../hooks/usePageTitle'

function NotFoundPage() {
  usePageTitle('Page Not Found — FastToolKits')

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-[#1E293B]">404 — Page Not Found</h1>
      <p className="text-[#64748B]">
        The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been built yet.
      </p>
      <Link to="/" className="btn btn-primary rounded-xl">
        Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
