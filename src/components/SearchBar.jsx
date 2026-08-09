function SearchBar({ value, onChange }) {
  return (
    <div className="mx-auto w-full max-w-xl text-left">
      <label htmlFor="tool-search" className="mb-2 block text-sm font-medium text-base-content">
        Search tools
      </label>
      <div className="input input-bordered w-full rounded-lg border-base-300 bg-base-100 py-3 text-base focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        <svg
          className="h-5 w-5 shrink-0 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>

        <input
          id="tool-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder='Search by name or keyword, e.g. "BMI" or "password"'
          autoComplete="off"
          className="w-full grow bg-transparent text-base-content placeholder:text-muted focus:outline-none"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="shrink-0 rounded-full p-1 text-muted transition-colors hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Clear search"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
