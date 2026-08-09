import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const BmiCalculatorPage = lazy(() => import('./pages/tools/BmiCalculatorPage'))
const AgeCalculatorPage = lazy(() => import('./pages/tools/AgeCalculatorPage'))
const TipCalculatorPage = lazy(() => import('./pages/tools/TipCalculatorPage'))
const PercentageCalculatorPage = lazy(() => import('./pages/tools/PercentageCalculatorPage'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

