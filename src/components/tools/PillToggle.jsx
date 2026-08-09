function PillToggle({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive
                ? 'border-primary bg-primary text-primary-content'
                : 'border-base-300 bg-base-100 text-base-content hover:border-primary hover:text-primary'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default PillToggle
