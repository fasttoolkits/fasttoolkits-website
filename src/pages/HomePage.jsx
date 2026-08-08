import { useMemo, useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import tools from '../data/tools'
import ToolCard from '../components/ToolCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'

function HomePage() {
  usePageTitle(
    'FastToolKits — Fast, free tools for everyday life',
    'Free online calculators and utilities for everyday life. No sign-up, no downloads — get a quick result in seconds.'
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(
    () => [...new Set(tools.map((tool) => tool.category))].sort(),
    []
  )

  const filteredTools = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return tools.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory
      const matchesSearch =
        term === '' ||
        tool.name.toLowerCase().includes(term) ||
        tool.keywords.some((keyword) => keyword.toLowerCase().includes(term))

      return matchesCategory && matchesSearch
    })
  }, [searchTerm, activeCategory])

  return (
    <div>
      <section className="px-4 py-12 text-center sm:px-8">
        <h1 className="text-4xl font-bold text-[#1E293B]">FastToolKits</h1>
        <p className="mt-2 text-lg text-[#64748B]">
          Fast, free tools for everyday life. No sign-up. No downloads.
        </p>
      </section>

      <section className="flex flex-col items-center gap-4 px-4 pb-8 sm:px-8">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </section>

      <section className="px-4 pb-12 sm:px-8">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#64748B]">
            No tools match your search. Try a different keyword or category.
          </p>
        )}
      </section>
    </div>
  )
}

export default HomePage
