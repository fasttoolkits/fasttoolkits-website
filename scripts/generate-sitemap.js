import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import tools from '../src/data/tools.js'
import { SITE_URL } from '../src/data/siteConfig.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '../dist')
const outputPath = resolve(distDir, 'sitemap.xml')

const paths = ['/', ...tools.map((tool) => tool.path), '/about', '/contact', '/privacy', '/terms']

const urlEntries = paths
  .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}

writeFileSync(outputPath, xml, 'utf8')

console.log(`Sitemap written to ${outputPath} with ${paths.length} URLs.`)
