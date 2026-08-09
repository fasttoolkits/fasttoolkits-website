import { Link } from 'react-router'
import usePageTitle from '../hooks/usePageTitle'
import PageHeader from '../components/PageHeader'
import ToolInfo from '../components/tools/ToolInfo'
import { buildWebPageStructuredData } from '../utils/structuredData'
import { SITE_EMAIL } from '../data/siteConfig'

const structuredData = buildWebPageStructuredData({
  name: 'Privacy Policy | FastToolKits',
  description:
    "Read FastToolKits' Privacy Policy to see what data our free browser-based tools collect, how analytics works, and our approach to future advertising.",
  path: '/privacy',
})

function PrivacyPolicyPage() {
  usePageTitle(
    'Privacy Policy | FastToolKits',
    "Read FastToolKits' Privacy Policy to see what data our free browser-based tools collect, how analytics works, and our approach to future advertising.",
    { structuredData }
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <PageHeader
        title="Privacy Policy"
        description="What actually happens with your information when you use FastToolKits, written in plain language."
      />

      <div className="mt-8 flex flex-col gap-10">
        <p className="text-sm text-muted">Last updated: August 10, 2026</p>

        <ToolInfo title="Introduction">
          <p>
            FastToolKits ("we," "us," "the site") is a website of free, browser-based calculators
            and utilities at fasttoolkits.com. This policy explains what information is collected
            when you use the site, what is not collected, and how the few active services we use
            actually work. It is written to match what the site currently does, not what a generic
            template says a website should do.
          </p>
        </ToolInfo>

        <ToolInfo title="Information We Collect">
          <p>
            FastToolKits does not require an account, login, or sign-up of any kind. We do not ask
            you to submit your name, email address, payment details, or any other personal
            information to use a tool.
          </p>
          <p>
            The values you type into a tool, such as your height and weight in the BMI Calculator,
            a loan amount, text for a QR code, or the options you choose for a generated password,
            are used only to perform that calculation inside your own browser. They are not sent to
            us, and we do not receive, see, or store them.
          </p>
        </ToolInfo>

        <ToolInfo title="Information Processed Automatically">
          <p>
            Like most websites, FastToolKits is served by a hosting provider (currently Vercel),
            which may automatically process standard technical request information, such as IP
            address, browser type, and request timestamps, in order to deliver pages and keep the
            infrastructure secure. This is a normal part of operating any website and is handled by
            Vercel's own infrastructure, not by a system we built or configured ourselves.
          </p>
        </ToolInfo>

        <ToolInfo title="Analytics">
          <p>
            FastToolKits currently uses Vercel Analytics to understand overall traffic, such as
            which pages are visited. Per Vercel's own documentation, Vercel Analytics is designed
            to work without cookies and without collecting information that identifies you
            individually.
          </p>
          <p>
            We do not currently use Google Analytics or any other analytics service, even though an
            earlier planning document for this project once listed it as a possibility.
          </p>
        </ToolInfo>

        <ToolInfo title="Tool Usage Data">
          <p>
            When you successfully use a tool, FastToolKits records one small analytics event
            through Vercel Analytics containing only the tool's name and its category, for example
            that the "BMI Calculator" tool in the "Health" category was used. This event never
            includes anything you typed in, such as your actual height, weight, generated password,
            QR code text, or loan figures.
          </p>
        </ToolInfo>

        <ToolInfo title="How Our Tools Process Your Input">
          <p>
            Every tool on FastToolKits, including the BMI Calculator, Age Calculator, Tip
            Calculator, Word Counter, Password Generator, Percentage Calculator, Unit Converter, QR
            Code Generator, Color Picker, and Loan Calculator, runs entirely inside your browser
            using JavaScript. None of them make a network request to send your input anywhere.
          </p>
          <p>
            For example, the Password Generator uses your browser's built-in random number
            generator and never transmits the result, and the QR Code Generator turns your text
            into an image locally, without uploading it anywhere.
          </p>
        </ToolInfo>

        <ToolInfo title="Cookies and Similar Technologies">
          <p>
            FastToolKits does not currently set its own cookies, and does not currently use
            localStorage or sessionStorage to store personal information about you.
          </p>
          <p>
            If we introduce Google AdSense in the future, that would change: Google and its
            advertising partners may set advertising cookies or use similar technologies as part of
            serving ads. That is covered separately below, and is not active today.
          </p>
        </ToolInfo>

        <ToolInfo title="Third-Party Services">
          <p>Services currently active on FastToolKits:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Vercel:</strong> hosts the website and provides Vercel Analytics, as described
              above.
            </li>
            <li>
              <strong>Google Fonts:</strong> the site loads the Inter font from Google's font
              servers, which involves your browser making a request to Google to fetch font files.
            </li>
          </ul>
          <p>
            No other third-party scripts, advertising networks, or tracking tools are currently
            present on FastToolKits.
          </p>
        </ToolInfo>

        <ToolInfo title="Advertising and Google AdSense">
          <p>
            <strong>Right now:</strong> Google AdSense is not installed and no ads are currently
            served on FastToolKits. Nothing in this section is active today.
          </p>
          <p>
            <strong>If we add Google AdSense in the future:</strong> we plan to apply for Google
            AdSense to help support the cost of running FastToolKits. If and when that happens,
            Google and its advertising partners may use cookies or similar technologies to serve
            ads, and to measure how ads perform. This can include using information about your
            visits to this and other sites to show ads that are more relevant to you, unless you
            choose otherwise. We will update this section and the "last updated" date above before
            any ads go live, so it always reflects what is actually running.
          </p>
        </ToolInfo>

        <ToolInfo title="Personalized Advertising and Your Choices">
          <p>
            This section describes what would apply only once Google AdSense is active, it is not
            in effect today.
          </p>
          <p>
            Once advertising is active, you would generally be able to manage personalized
            advertising through Google's own settings at adssettings.google.com, and through
            industry opt-out pages such as optout.aboutads.info. For visitors in the European
            Economic Area, the United Kingdom, and Switzerland, we intend to use a consent
            management platform that meets Google's requirements, including compliance with the IAB
            Transparency and Consent Framework, so that personalized ads would only load after you
            have made a consent choice.
          </p>
        </ToolInfo>

        <ToolInfo title="Data Retention">
          <p>
            We do not retain the values you enter into a tool, since they are never sent to us in
            the first place. The small "tool used" analytics events described above are processed
            by Vercel Analytics under Vercel's own retention practices; we have not configured a
            separate, custom retention period of our own.
          </p>
        </ToolInfo>

        <ToolInfo title="Data Security">
          <p>
            FastToolKits is served over HTTPS. Because we do not collect personal information or
            store the data you type into a tool, there is very little of that kind of information
            for us to protect in the first place. The hosting infrastructure that runs the site is
            maintained and secured by Vercel.
          </p>
        </ToolInfo>

        <ToolInfo title="Children's Privacy">
          <p>
            FastToolKits is not directed at children, and we do not knowingly collect personal
            information from anyone, including children under 13, through any tool on this site.
          </p>
        </ToolInfo>

        <ToolInfo title="External Links">
          <p>
            FastToolKits does not currently link out to third-party websites within its own pages.
            The one exception is content you create yourself: the QR Code Generator turns whatever
            text or link you type into an image. If you choose to encode a website address, that
            destination is controlled by whoever owns that site, not by FastToolKits, and we have
            no visibility into what happens after a code is scanned.
          </p>
        </ToolInfo>

        <ToolInfo title="Your Rights and Privacy Requests">
          <p>
            Because FastToolKits does not collect personal information through its tools or require
            an account, there is generally no personal data of yours on file for us to access,
            correct, or delete. If you believe we hold information about you, or you have any
            question about how this policy applies to you, email us at{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-primary hover:underline">
              {SITE_EMAIL}
            </a>
            .
          </p>
        </ToolInfo>

        <ToolInfo title="Changes to This Policy">
          <p>
            We may update this Privacy Policy as FastToolKits changes, for example before turning
            on Google AdSense or adding a new service. When we do, we will update the "last
            updated" date at the top of this page, and any change to our advertising status will be
            reflected in the Advertising and Google AdSense section above.
          </p>
        </ToolInfo>

        <ToolInfo title="Contact Information">
          <p>
            Questions about this policy or how FastToolKits works can be sent to{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-primary hover:underline">
              {SITE_EMAIL}
            </a>
            . You can also visit our{' '}
            <Link to="/contact" className="font-medium text-primary hover:underline">
              Contact page
            </Link>
            .
          </p>
        </ToolInfo>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
