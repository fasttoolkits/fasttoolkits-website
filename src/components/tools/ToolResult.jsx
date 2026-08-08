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
      className="rounded-lg border border-base-300 bg-base-100 p-6 text-center"
    >
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 text-4xl font-bold text-base-content sm:text-5xl">{value}</p>

      {statusLabel && (
        <span className={`badge badge-lg mt-3 ${BADGE_VARIANT_CLASSES[statusVariant] ?? BADGE_VARIANT_CLASSES.info}`}>
          {statusLabel}
        </span>
      )}

      {description && <p className="mx-auto mt-3 max-w-sm text-sm text-muted">{description}</p>}
    </div>
  )
}

export default ToolResult
