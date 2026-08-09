function CopyButton({ onCopy, isCopied, label = 'Copy', className = 'btn btn-outline btn-primary btn-sm' }) {
  return (
    <button type="button" onClick={onCopy} className={`shrink-0 ${className}`}>
      {isCopied ? 'Copied' : label}
    </button>
  )
}

export default CopyButton
