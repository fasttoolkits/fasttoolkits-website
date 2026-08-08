function SearchBar({ value, onChange }) {
  return (
    <div className="w-full max-w-md">
      <label htmlFor="tool-search" className="mb-1 block text-sm font-medium text-[#1E293B]">
        Search tools
      </label>
      <input
        id="tool-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name or keyword..."
        className="input input-bordered w-full rounded-xl"
      />
    </div>
  )
}

export default SearchBar
