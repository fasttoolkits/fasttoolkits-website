import { track } from '@vercel/analytics'

function getToolSlug(tool) {
  return tool.path.replace(/^\//, '')
}

export function trackToolUsage(tool) {
  if (!tool) return

  try {
    track('tool_use', {
      tool_name: getToolSlug(tool),
      category: tool.category,
    })
  } catch {
    // Analytics must never interfere with tool functionality.
  }
}
