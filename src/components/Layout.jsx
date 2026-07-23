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
        <p>Powered by OpenWeatherMap</p>
      </footer>
    </div>
  )
}

export default memo(Layout)
