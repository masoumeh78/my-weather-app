import { memo } from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">
        <span aria-hidden="true">☁</span> SkyCast
      </NavLink>
      <nav className="navbar__links" aria-label="Main navigation">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/details">Details</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
    </header>
  )
}

export default memo(Navbar)
