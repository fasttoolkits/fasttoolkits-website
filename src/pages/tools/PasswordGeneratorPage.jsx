import { useState } from 'react'
import usePageTitle from '../../hooks/usePageTitle'
import useClipboardCopy from '../../hooks/useClipboardCopy'
import tools from '../../data/tools'
import ToolLayout from '../../layouts/ToolLayout'
import ToolResult from '../../components/tools/ToolResult'
import ToolInfo from '../../components/tools/ToolInfo'
import CopyButton from '../../components/tools/CopyButton'
import {
  MIN_LENGTH,
  MAX_LENGTH,
  MAX_WORDS_INPUT_LENGTH,
  generatePassword,
  getPasswordStrength,
  parseCustomWords,
  DEFAULT_LENGTH,
} from '../../tools/password/passwordGenerator'
import { buildToolStructuredData } from '../../utils/structuredData'
import { trackToolUsage } from '../../utils/analytics'

const tool = tools.find((item) => item.path === '/password-generator')
const structuredData = buildToolStructuredData(tool)

const initialOptions = {
  useUppercase: true,
  useLowercase: true,
  useNumbers: true,
  useSymbols: true,
}

const CHARACTER_OPTIONS = [
  { key: 'useUppercase', label: 'Uppercase letters (A-Z)' },
  { key: 'useLowercase', label: 'Lowercase letters (a-z)' },
  { key: 'useNumbers', label: 'Numbers (0-9)' },
  { key: 'useSymbols', label: 'Symbols (!@#$%...)' },
]

function getSliderValue(length) {
  const parsed = Number(length)
  if (Number.isFinite(parsed) && parsed >= MIN_LENGTH && parsed <= MAX_LENGTH) {
    return parsed
  }
  return MIN_LENGTH
}

function PasswordGeneratorPage() {
  usePageTitle(
    'Password Generator: Create Strong, Random Passwords | FastToolKits',
    'Generate a strong, random password instantly. Choose your length and character options, then create a secure password directly in your browser. Free, no signup.',
    { structuredData }
  )

  const [length, setLength] = useState(String(DEFAULT_LENGTH))
  const [lengthError, setLengthError] = useState('')
  const [customWords, setCustomWords] = useState('')
  const [wordsError, setWordsError] = useState('')
  const [options, setOptions] = useState(initialOptions)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const { copiedKey, copy } = useClipboardCopy()

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
    setResult(null)
    setError('')
  }

  const handleSliderChange = (value) => {
    setLength(value)
    setLengthError('')
    setResult(null)
    setError('')
  }

  const handleLengthInputChange = (value) => {
    setLength(value)
    setResult(null)
    setError('')

    if (value.trim() === '') {
      setLengthError('Please enter a password length.')
      return
    }

    const parsed = Number(value)
    if (!Number.isInteger(parsed)) {
      setLengthError('Please enter a whole number.')
      return
    }
    if (parsed < MIN_LENGTH || parsed > MAX_LENGTH) {
      setLengthError(`Please enter a length between ${MIN_LENGTH} and ${MAX_LENGTH}.`)
      return
    }
    setLengthError('')
  }

  const handleWordsChange = (value) => {
    setCustomWords(value)
    setResult(null)
    setError('')

    if (value.trim() === '') {
      setWordsError('')
      return
    }
    const { error: parseError } = parseCustomWords(value)
    setWordsError(parseError || '')
  }

  const handleGenerate = (event) => {
    event.preventDefault()
    const { password, words, error: generationError } = generatePassword({ length, customWords, ...options })

    if (generationError) {
      setError(generationError)
      setResult(null)
      return
    }

    setError('')
    setResult({ password, words, options })
    trackToolUsage(tool)
  }

  const handleReset = () => {
    setLength(String(DEFAULT_LENGTH))
    setLengthError('')
    setCustomWords('')
    setWordsError('')
    setOptions(initialOptions)
    setError('')
    setResult(null)
  }

  const strength = result ? getPasswordStrength(result.password, { ...result.options, customWords: result.words }) : null

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        <form onSubmit={handleGenerate} noValidate className="flex flex-col gap-6">
          <div>
            <span id="password-length-label" className="mb-2 block text-sm font-medium text-base-content">
              Password length
            </span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex shrink-0 items-center gap-2">
                <label htmlFor="password-length-input" className="sr-only">
                  Exact password length
                </label>
                <input
                  id="password-length-input"
                  type="number"
                  inputMode="numeric"
                  min={MIN_LENGTH}
                  max={MAX_LENGTH}
                  step="1"
                  className="input input-bordered input-sm w-20 text-center"
                  value={length}
                  onChange={(event) => handleLengthInputChange(event.target.value)}
                  aria-invalid={Boolean(lengthError)}
                  aria-describedby={lengthError ? 'password-length-error' : undefined}
                />
                <span className="text-sm text-muted">characters</span>
              </div>
              <input
                type="range"
                aria-labelledby="password-length-label"
                min={MIN_LENGTH}
                max={MAX_LENGTH}
                step="1"
                value={getSliderValue(length)}
                onChange={(event) => handleSliderChange(event.target.value)}
                className="range range-primary min-w-0 sm:flex-1"
              />
            </div>
            {lengthError && (
              <p id="password-length-error" role="alert" className="mt-2 text-sm text-error">
                {lengthError}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-base-content">Include</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CHARACTER_OPTIONS.map((option) => (
                <label key={option.key} className="flex cursor-pointer items-center gap-3 text-sm text-base-content">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={options[option.key]}
                    onChange={() => toggleOption(option.key)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="password-words" className="mb-1 block text-sm font-medium text-base-content">
              Optional words to include
            </label>
            <p className="mb-2 text-xs text-muted">
              Add any words you want to include in your password.
            </p>
            <input
              id="password-words"
              type="text"
              className="input input-bordered w-full"
              value={customWords}
              onChange={(event) => handleWordsChange(event.target.value)}
              placeholder="coffee mountain travel"
              maxLength={MAX_WORDS_INPUT_LENGTH}
              aria-invalid={Boolean(wordsError)}
              aria-describedby={wordsError ? 'password-words-error' : undefined}
            />
            {wordsError && (
              <p id="password-words-error" role="alert" className="mt-2 text-sm text-error">
                {wordsError}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-error">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary">
              Generate password
            </button>
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 flex flex-col gap-3">
            <ToolResult
              label="Your password"
              value={result.password}
              statusLabel={strength?.label}
              statusVariant={strength?.variant}
              description={strength?.note}
            />
            <div className="flex justify-center">
              <CopyButton onCopy={() => copy(result.password, 'password')} isCopied={copiedKey === 'password'} />
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-muted">
        Your password is generated entirely in your browser. It is never sent to a server or
        saved anywhere.
      </p>

      <ToolInfo title="How strength is estimated">
        <p>
          The strength label is a rough estimate based on length and the character types you
          use. It is not a guarantee, and no password is completely unbreakable.
        </p>
        <p>
          Using your own words can make a password easier to remember, but words you choose
          yourself can also be easier to guess. That&apos;s why passwords with your own words are
          capped at a Fair strength label here.
        </p>
      </ToolInfo>

      <ToolInfo title="What makes a password strong?">
        <ul className="list-disc space-y-1 pl-5">
          <li>Length matters. Longer passwords are generally harder to guess than shorter ones.</li>
          <li>Use a different password for each account, so one leaked password does not put your other accounts at risk.</li>
          <li>Avoid predictable patterns and personal information, such as names, birthdays, or common words.</li>
          <li>A longer, random password generally offers stronger protection than a short one.</li>
        </ul>
      </ToolInfo>

      <ToolInfo title="Is it safe to use this password generator?">
        <p>
          Yes. This generator creates your password entirely in your browser, using your
          browser&apos;s built-in random number generator. Your password is never sent to
          FastToolKits servers or saved anywhere.
        </p>
        <p>
          Our analytics only record that the password generator was used. They do not receive
          your generated password, its length, or which character types you chose.
        </p>
      </ToolInfo>

      <ToolInfo title="Where should I store my passwords?">
        <p>
          Avoid keeping passwords in plain text files, notes apps, or written somewhere others
          can find them. A reputable password manager can generate, store, and fill in your
          passwords securely, so you only need to remember one master password.
        </p>
      </ToolInfo>

      <section aria-labelledby="password-faq-heading">
        <h2 id="password-faq-heading" className="text-lg font-semibold text-base-content">
          Frequently asked questions
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Is this password sent to a server?
            </summary>
            <div className="collapse-content text-sm text-muted">
              No. The password is created using your browser&apos;s built-in random number
              generator and stays on your device.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What if I uncheck every character type?
            </summary>
            <div className="collapse-content text-sm text-muted">
              You need to choose at least one character type. If none are selected, you&apos;ll
              see a message asking you to pick one before generating a password.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How long should my password be?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Longer is generally safer. Many sites require at least 8 characters, but 12 or more
              with a mix of character types is a stronger choice where allowed.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How do the optional words work?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Type any word or words you want to include, using letters only, separated by
              spaces. They are combined with your chosen letter case, and any numbers or symbols
              you selected are added around them. Leave this blank for a fully random password
              instead.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              Should I use the same password for multiple accounts?
            </summary>
            <div className="collapse-content text-sm text-muted">
              It&apos;s best to use a unique password for each account. If one site is breached
              and you reuse passwords, attackers can use the leaked password to try to access
              your other accounts.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              What is the difference between a password and a passphrase?
            </summary>
            <div className="collapse-content text-sm text-muted">
              A password is typically a short string of random characters. A passphrase is
              usually a sequence of random, unrelated words, which can be longer and easier to
              remember while still being hard to guess.
            </div>
          </details>

          <details className="collapse collapse-arrow border border-base-300 bg-base-100">
            <summary className="collapse-title text-sm font-medium text-base-content">
              How often should I change my passwords?
            </summary>
            <div className="collapse-content text-sm text-muted">
              Strong passwords generally do not need to be changed on an arbitrary schedule.
              Change a password immediately if you believe it has been exposed, compromised, or
              reused on a service that had a data breach.
            </div>
          </details>
        </div>
      </section>
    </ToolLayout>
  )
}

export default PasswordGeneratorPage
