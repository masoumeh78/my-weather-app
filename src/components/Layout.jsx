import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          Powered by
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-500 hover:underline"
          >
            OpenWeatherMap
          </a>
        </p>
        <p>
          Designed & Developed with
          <Heart size={14} className="inline text-red-500" /> by{" "}
          <span className="font-bold text-gray-800 dark:text-white">
            <a
              href="https://www.linkedin.com/in/masoume-masoumi/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-500 hover:underline"
            >
              Masoume Masoumi
            </a>
          </span>
        </p>
      </footer>
    </div>
  )
}

export default memo(Layout)
