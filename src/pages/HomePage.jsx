import { useEffect, useMemo, useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import tools from '../data/tools'
import { SITE_DESCRIPTION } from '../data/siteConfig'
import { buildWebsiteStructuredData } from '../utils/structuredData'
import ToolCard from '../components/ToolCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'

const POPULAR_TOOL_NAMES = ['BMI Calculator', 'Word Counter', 'Password Generator', 'Unit Converter']
const homeStructuredData = buildWebsiteStructuredData()

function HomePage() {
  usePageTitle('FastToolKits | Fast, free tools for everyday life', SITE_DESCRIPTION, {
    structuredData: homeStructuredData,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    if (window.location.hash === '#tools') {
      document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const categories = useMemo(() => [...new Set(tools.map((tool) => tool.category))].sort(), [])

  const popularTools = useMemo(
    () => tools.filter((tool) => POPULAR_TOOL_NAMES.includes(tool.name)),
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

  const handlePopularSelect = (toolName) => {
    setActiveCategory('All')
    setSearchTerm(toolName)
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setActiveCategory('All')
  }

  return (
    <div>
      <section className="px-4 py-14 text-center sm:px-8 sm:py-20">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
          Fast, free tools for everyday tasks
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted sm:text-lg">
          Simple calculators and utilities that run right in your browser. No sign-up, no
          downloads, no waiting.
        </p>

        <div className="mt-8 flex justify-center">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        {popularTools.length > 0 && (
          <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm">
            <span className="mr-1 text-muted">Popular:</span>
            {popularTools.map((tool) => (
              <button
                key={tool.path}
                type="button"
                onClick={() => handlePopularSelect(tool.name)}
                className="rounded-full px-2 py-1 font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {tool.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="px-4 pb-10 sm:px-8">
        <h2 className="sr-only">Browse by category</h2>
        <CategoryFilter categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </section>

      <section id="tools" className="scroll-mt-20 px-4 pb-16 sm:px-8">
        <div className="mx-auto mb-6 flex max-w-6xl items-baseline justify-between">
          <h2 className="text-lg font-semibold text-base-content">
            {activeCategory === 'All' ? 'All tools' : activeCategory}
          </h2>
          <span className="text-sm text-muted">
            {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted">No tools match your search. Try a different keyword or category.</p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
