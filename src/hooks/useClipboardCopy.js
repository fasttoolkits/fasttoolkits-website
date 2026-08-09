import { useCallback, useEffect, useRef, useState } from 'react'

const RESET_DELAY_MS = 2000

function useClipboardCopy() {
  const [copiedKey, setCopiedKey] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const copy = useCallback(async (text, key = 'default') => {
    if (!navigator.clipboard) return false

    try {
      await navigator.clipboard.writeText(text)
      clearTimeout(timeoutRef.current)
      setCopiedKey(key)
      timeoutRef.current = setTimeout(() => setCopiedKey(null), RESET_DELAY_MS)
      return true
    } catch {
      return false
    }
  }, [])

  return { copiedKey, copy }
}

export default useClipboardCopy
