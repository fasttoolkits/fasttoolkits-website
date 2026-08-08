function ToolInfo({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-base-content">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  )
}

export default ToolInfo
