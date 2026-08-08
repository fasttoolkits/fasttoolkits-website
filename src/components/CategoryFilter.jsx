function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={() => onSelect('All')}
        className={`btn btn-sm rounded-xl ${activeCategory === 'All' ? 'btn-primary' : 'btn-outline'}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`btn btn-sm rounded-xl ${activeCategory === category ? 'btn-primary' : 'btn-outline'}`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
