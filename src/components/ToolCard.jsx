import { Link } from 'react-router'

function ToolCard({ tool }) {
  return (
    <Link
      to={tool.path}
      className="card rounded-xl border border-base-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="badge badge-outline badge-sm mb-2 w-fit">{tool.category}</span>
      <h3 className="text-lg font-bold text-[#1E293B]">{tool.name}</h3>
      <p className="mt-1 text-sm text-[#64748B]">{tool.description}</p>
    </Link>
  )
}

export default ToolCard
