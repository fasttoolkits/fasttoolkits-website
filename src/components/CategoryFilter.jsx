function CategoryFilter({ categories, activeCategory, onSelect }) {
  const allCategories = ['All', ...categories]

  return (
    <div
      role="group"
      aria-label="Filter tools by category"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
    >
      {allCategories.map((category) => {
        const isActive = activeCategory === category

        return (
          <button
            key={category}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(category)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive
                ? 'border-primary bg-primary text-primary-content'
                : 'border-base-300 bg-base-100 text-base-content hover:border-primary hover:text-primary'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
