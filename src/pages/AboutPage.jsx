import { Link } from 'react-router'
import usePageTitle from '../hooks/usePageTitle'
import PageHeader from '../components/PageHeader'
import ToolInfo from '../components/tools/ToolInfo'
import { buildWebPageStructuredData } from '../utils/structuredData'

const structuredData = buildWebPageStructuredData({
  name: 'About FastToolKits',
  description:
    'FastToolKits is a free collection of simple, privacy-conscious browser tools and calculators. Learn what it is, why it exists, and how it works.',
  path: '/about',
})

function AboutPage() {
  usePageTitle(
    'About FastToolKits',
    'FastToolKits is a free collection of simple, privacy-conscious browser tools and calculators. Learn what it is, why it exists, and how it works.',
    { structuredData }
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageHeader
        title="About FastToolKits"
        description="A quick, no-nonsense collection of tools for everyday tasks."
      />

      <div className="mt-8 flex flex-col gap-10">
        <ToolInfo title="What FastToolKits Is">
          <p>
            FastToolKits is a free website with a growing collection of small, focused tools:
            calculators, generators, and converters that each solve one specific task. Every tool
            lives on its own page, works instantly, and does not ask you to sign up first.
          </p>
        </ToolInfo>

        <ToolInfo title="Why It Exists">
          <p>
            Plenty of online tools bury a simple calculation under ads, pop-ups, or an account
            wall. FastToolKits exists to be the opposite: type in what you need, get your answer,
            and move on with your day.
          </p>
        </ToolInfo>

        <ToolInfo title="The Kind of Tools We Build">
          <p>
            FastToolKits currently covers a few everyday categories: health (like the{' '}
            <Link to="/bmi-calculator" className="font-medium text-primary hover:underline">
              BMI Calculator
            </Link>
            ), everyday math (tips, percentages, unit conversion, age), writing (word counting),
            security (the{' '}
            <Link to="/password-generator" className="font-medium text-primary hover:underline">
              Password Generator
            </Link>
            ), finance (loan estimates), design (color picking), and utilities (the{' '}
            <Link to="/qr-code-generator" className="font-medium text-primary hover:underline">
              QR Code Generator
            </Link>
            ). You can browse the full, current list on the{' '}
            <Link to="/#tools" className="font-medium text-primary hover:underline">
              homepage
            </Link>
            . More tools are added over time.
          </p>
        </ToolInfo>

        <ToolInfo title="Privacy-Conscious by Design">
          <p>
            Every tool on FastToolKits runs directly in your browser. Your height and weight, your
            generated password, the text in your QR code, none of it is sent to a server or saved
            anywhere by us. You can read exactly what that means in our{' '}
            <Link to="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </ToolInfo>

        <ToolInfo title="No Sign-Up Required">
          <p>
            You will never be asked to create an account, verify an email, or hand over personal
            details to use a tool on FastToolKits. Open the tool, use it, done. Tools are designed
            to give you an answer quickly, without getting in your way.
          </p>
        </ToolInfo>

        <ToolInfo title="Questions or Suggestions">
          <p>
            If something looks wrong, or you have an idea for a tool we should build, our{' '}
            <Link to="/contact" className="font-medium text-primary hover:underline">
              Contact page
            </Link>{' '}
            has the details.
          </p>
        </ToolInfo>

        <p className="border-t border-base-300 pt-6 text-sm text-muted">
          Built and maintained by{' '}
          <a
            href="https://www.thecraftaxis.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            The CraftAxis
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default AboutPage
