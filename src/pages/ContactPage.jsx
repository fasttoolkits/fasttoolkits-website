import usePageTitle from '../hooks/usePageTitle'
import PageHeader from '../components/PageHeader'
import ToolInfo from '../components/tools/ToolInfo'
import { buildWebPageStructuredData } from '../utils/structuredData'
import { SITE_EMAIL } from '../data/siteConfig'

const structuredData = buildWebPageStructuredData({
  name: 'Contact FastToolKits',
  description:
    'Get in touch with FastToolKits to report a bug, suggest a new tool, ask a privacy question, or share feedback.',
  path: '/contact',
})

function ContactPage() {
  usePageTitle(
    'Contact FastToolKits',
    'Get in touch with FastToolKits to report a bug, suggest a new tool, ask a privacy question, or share feedback.',
    { structuredData }
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageHeader
        title="Contact FastToolKits"
        description="What you can reach out about, and the current state of how to do it."
      />

      <div className="mt-8 flex flex-col gap-10">
        <ToolInfo title="What You Can Contact Us About">
          <ul className="list-disc space-y-1 pl-5">
            <li>Report a bug or something that is not working correctly</li>
            <li>Report incorrect information on a tool or page</li>
            <li>Suggest a new tool you would find useful</li>
            <li>Ask a question about privacy or how a tool works</li>
            <li>Share general feedback about FastToolKits</li>
          </ul>
        </ToolInfo>

        <ToolInfo title="How to Reach Us">
          <p>
            Email us at{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-primary hover:underline">
              {SITE_EMAIL}
            </a>{' '}
            and we will get back to you. We read every message, though replies may take a little
            time since FastToolKits is a small, independently run site.
          </p>
        </ToolInfo>
      </div>
    </div>
  )
}

export default ContactPage
