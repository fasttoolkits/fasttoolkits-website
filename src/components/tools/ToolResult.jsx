const BADGE_VARIANT_CLASSES = {
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
}

function ToolResult({ label, value, statusLabel, statusVariant = 'info', description }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="@container min-w-0 rounded-lg border border-base-300 bg-base-100 p-5 text-center sm:p-6"
    >
      <p className="break-words text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold break-words text-base-content [overflow-wrap:anywhere] @xs:text-3xl @sm:text-4xl @lg:text-5xl">
        {value}
      </p>

      {statusLabel && (
        <span className={`badge badge-lg mt-3 ${BADGE_VARIANT_CLASSES[statusVariant] ?? BADGE_VARIANT_CLASSES.info}`}>
          {statusLabel}
        </span>
      )}

      {description && <p className="mx-auto mt-3 max-w-sm break-words text-sm text-muted">{description}</p>}
    </div>
  )
}

export default ToolResult
