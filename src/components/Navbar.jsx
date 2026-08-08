import { Link } from 'react-router'

function Navbar() {
  return (
    <header className="navbar border-b border-base-200 bg-white px-4 sm:px-8">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-[#2563EB]">
          FastToolKits
        </Link>
      </div>
    </header>
  )
}

export default Navbar
