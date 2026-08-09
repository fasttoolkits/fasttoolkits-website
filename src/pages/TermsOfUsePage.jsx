import usePageTitle from '../hooks/usePageTitle'
import PageHeader from '../components/PageHeader'
import ToolInfo from '../components/tools/ToolInfo'
import { buildWebPageStructuredData } from '../utils/structuredData'
import { SITE_EMAIL } from '../data/siteConfig'

const structuredData = buildWebPageStructuredData({
  name: 'Terms of Use | FastToolKits',
  description:
    'Terms of Use for FastToolKits: what to expect from our free tools, key disclaimers for health and finance tools, and your responsibilities as a user.',
  path: '/terms',
})

function TermsOfUsePage() {
  usePageTitle(
    'Terms of Use | FastToolKits',
    'Terms of Use for FastToolKits: what to expect from our free tools, key disclaimers for health and finance tools, and your responsibilities as a user.',
    { structuredData }
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageHeader
        title="Terms of Use"
        description="The rules for using FastToolKits, written to be understandable, not intimidating."
      />

      <div className="mt-8 flex flex-col gap-10">
        <p className="text-sm text-muted">Last updated: August 10, 2026</p>

        <ToolInfo title="Use of FastToolKits">
          <p>
            These Terms of Use ("Terms") cover your use of FastToolKits (fasttoolkits.com, "we,"
            "us," "the site"). By using this site, you agree to these Terms. If you do not agree,
            please do not use the site.
          </p>
        </ToolInfo>

        <ToolInfo title="Free Tools and Services">
          <p>
            Every tool on FastToolKits is free to use. We do not currently charge for access to any
            tool, and we do not require you to create an account or provide payment information.
          </p>
        </ToolInfo>

        <ToolInfo title="Informational, General-Purpose Nature of Tools">
          <p>
            The calculators and tools on FastToolKits are provided for general, informational
            purposes only. They are not a substitute for professional advice, including medical,
            financial, legal, or other professional advice.
          </p>
        </ToolInfo>

        <ToolInfo title="Accuracy Limitations">
          <p>
            We try to make sure our tools calculate correctly, but we cannot guarantee that every
            result is free of errors, especially for unusual inputs or edge cases. Always
            double-check important results, particularly before making a decision based on them.
          </p>
        </ToolInfo>

        <ToolInfo title="User Responsibility">
          <p>
            You are responsible for how you use the results from any tool on this site. Decisions
            you make based on a calculation, whether about your health, finances, passwords, or
            anything else, are your own responsibility.
          </p>
        </ToolInfo>

        <ToolInfo title="Health-Related Disclaimer (BMI Calculator)">
          <p>
            The BMI Calculator is for informational purposes only and is not medical advice. Body
            Mass Index is a general screening measure that does not account for factors like muscle
            mass, bone density, age, or sex. Talk to a qualified healthcare provider about your
            health, and do not use this tool to diagnose or treat any condition.
          </p>
        </ToolInfo>

        <ToolInfo title="Financial Disclaimer (Loan Calculator)">
          <p>
            The Loan Calculator is for informational purposes only and is not financial advice. It
            estimates payments using a standard fixed-rate formula and does not include taxes,
            insurance, fees, or the specific terms a real lender may offer. Speak with a qualified
            financial professional or your lender before making financial decisions.
          </p>
        </ToolInfo>

        <ToolInfo title="Password Generator Limitations">
          <p>
            The Password Generator creates passwords using your browser's built-in random number
            generator and runs entirely on your device; we never see or store the passwords it
            creates. The strength label it shows is a rough estimate, not a guarantee, and no
            password is completely unbreakable. You are responsible for storing and managing your
            own passwords securely.
          </p>
        </ToolInfo>

        <ToolInfo title="Availability and Service Changes">
          <p>
            We may change, update, suspend, or discontinue any tool or part of FastToolKits at any
            time, with or without notice. We do not guarantee that the site or any tool will be
            available at all times or free of interruptions.
          </p>
        </ToolInfo>

        <ToolInfo title="Intellectual Property">
          <p>
            The design, layout, branding, and code of FastToolKits belong to FastToolKits unless
            otherwise noted. You may not copy, resell, or republish the site or its tools as your
            own. Content you create using our tools, such as a generated QR code or password, is
            yours to use.
          </p>
        </ToolInfo>

        <ToolInfo title="Acceptable Use">
          <p>
            Please use FastToolKits as intended. Do not attempt to disrupt the site, access it
            through automated scraping that overloads our systems, or use any tool for an unlawful
            purpose, including generating content that infringes on someone else's rights or that
            you use to deceive or harm others, for example a QR code that links to malicious
            content.
          </p>
        </ToolInfo>

        <ToolInfo title="External Links">
          <p>
            FastToolKits does not currently link out to third-party sites within its own pages,
            aside from content you create yourself using tools like the QR Code Generator. We are
            not responsible for the content, accuracy, or practices of any destination you choose
            to link to using our tools.
          </p>
        </ToolInfo>

        <ToolInfo title="Limitation of Liability">
          <p>
            FastToolKits is provided "as is," without warranties of any kind. To the fullest extent
            permitted by law, FastToolKits is not liable for any damages, losses, or issues that
            result from your use of, or inability to use, the site or its tools, including reliance
            on any calculation or result.
          </p>
        </ToolInfo>

        <ToolInfo title="Changes to These Terms">
          <p>
            We may update these Terms from time to time as the site grows or changes. We will
            update the "last updated" date at the top of this page when we do. Continued use of
            FastToolKits after a change means you accept the updated Terms.
          </p>
        </ToolInfo>

        <ToolInfo title="Contact Information">
          <p>
            Questions about these Terms can be sent to{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-primary hover:underline">
              {SITE_EMAIL}
            </a>
            .
          </p>
        </ToolInfo>
      </div>
    </div>
  )
}

export default TermsOfUsePage
