import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WeatherProvider } from './context/WeatherContext.jsx'
import Layout from './components/Layout.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Details = lazy(() => import('./pages/Details.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))

function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner label="Loading page…" />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="details" element={<Details />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </WeatherProvider>
  )
}

export default App
