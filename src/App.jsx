import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Analytics } from '@vercel/analytics/react'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'))

const BmiCalculatorPage = lazy(() => import('./pages/tools/BmiCalculatorPage'))
const AgeCalculatorPage = lazy(() => import('./pages/tools/AgeCalculatorPage'))
const TipCalculatorPage = lazy(() => import('./pages/tools/TipCalculatorPage'))
const PercentageCalculatorPage = lazy(() => import('./pages/tools/PercentageCalculatorPage'))
const WordCounterPage = lazy(() => import('./pages/tools/WordCounterPage'))
const PasswordGeneratorPage = lazy(() => import('./pages/tools/PasswordGeneratorPage'))
const UnitConverterPage = lazy(() => import('./pages/tools/UnitConverterPage'))
const QrCodeGeneratorPage = lazy(() => import('./pages/tools/QrCodeGeneratorPage'))
const ColorPickerPage = lazy(() => import('./pages/tools/ColorPickerPage'))
const LoanCalculatorPage = lazy(() => import('./pages/tools/LoanCalculatorPage'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/about"
            element={
              <Suspense fallback={null}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={null}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={null}>
                <PrivacyPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={null}>
                <TermsOfUsePage />
              </Suspense>
            }
          />
          <Route
            path="/bmi-calculator"
            element={
              <Suspense fallback={null}>
                <BmiCalculatorPage />
              </Suspense>
            }
          />
          <Route
            path="/age-calculator"
            element={
              <Suspense fallback={null}>
                <AgeCalculatorPage />
              </Suspense>
            }
          />
          <Route
            path="/tip-calculator"
            element={
              <Suspense fallback={null}>
                <TipCalculatorPage />
              </Suspense>
            }
          />
          <Route
            path="/percentage-calculator"
            element={
              <Suspense fallback={null}>
                <PercentageCalculatorPage />
              </Suspense>
            }
          />
          <Route
            path="/word-counter"
            element={
              <Suspense fallback={null}>
                <WordCounterPage />
              </Suspense>
            }
          />
          <Route
            path="/password-generator"
            element={
              <Suspense fallback={null}>
                <PasswordGeneratorPage />
              </Suspense>
            }
          />
          <Route
            path="/unit-converter"
            element={
              <Suspense fallback={null}>
                <UnitConverterPage />
              </Suspense>
            }
          />
          <Route
            path="/qr-code-generator"
            element={
              <Suspense fallback={null}>
                <QrCodeGeneratorPage />
              </Suspense>
            }
          />
          <Route
            path="/color-picker"
            element={
              <Suspense fallback={null}>
                <ColorPickerPage />
              </Suspense>
            }
          />
          <Route
            path="/loan-calculator"
            element={
              <Suspense fallback={null}>
                <LoanCalculatorPage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App

