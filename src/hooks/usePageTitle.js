import { useEffect } from 'react'
import { SITE_URL, SITE_NAME } from '../data/siteConfig'

function upsertMetaByName(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function upsertMetaByProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function upsertCanonicalLink(href) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function upsertStructuredData(data) {
  const existing = document.getElementById('structured-data')

  if (!data) {
    if (existing) existing.remove()
    return
  }

  const script = existing ?? document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'structured-data'
  script.textContent = JSON.stringify(data)

  if (!existing) {
    document.head.appendChild(script)
  }
}

function getCanonicalPath() {
  const pathname = window.location.pathname
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

function usePageTitle(title, description, options = {}) {
  const { structuredData, noindex } = options

  useEffect(() => {
    if (title) {
      document.title = title
      upsertMetaByProperty('og:title', title)
    }

    if (description) {
      upsertMetaByName('description', description)
      upsertMetaByProperty('og:description', description)
    }

    const canonicalUrl = `${SITE_URL}${getCanonicalPath()}`
    upsertCanonicalLink(canonicalUrl)
    upsertMetaByProperty('og:url', canonicalUrl)
    upsertMetaByProperty('og:type', 'website')
    upsertMetaByProperty('og:site_name', SITE_NAME)

    upsertMetaByName('robots', noindex ? 'noindex, follow' : 'index, follow')

    upsertStructuredData(structuredData)
  }, [title, description, structuredData, noindex])
}

export default usePageTitle
