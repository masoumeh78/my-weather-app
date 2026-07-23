import { memo, useState } from 'react'
import { useWeather } from '../context/WeatherContext.jsx'
import ErrorAlert from '../components/ErrorAlert.jsx'

function Settings() {
  const {
    preferences,
    updatePreferences,
    searchCity,
    clearError,
    error,
    loading,
  } = useWeather()

  const [defaultCity, setDefaultCity] = useState(preferences.defaultCity)
  const [saved, setSaved] = useState(false)

  const handleUnitsChange = (event) => {
    updatePreferences({ units: event.target.value })
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const trimmed = defaultCity.trim()
    if (!trimmed) return

    updatePreferences({ defaultCity: trimmed })
    setSaved(true)

    try {
      await searchCity(trimmed)
    } catch {
      // Error surfaced via context
    }
  }

  return (
    <div className="page page--settings">
      <div className="page__intro">
        <h1>Settings</h1>
        <p className="page__subtitle">
          Customize your SkyCast experience and app preferences.
        </p>
      </div>

      {error && <ErrorAlert error={error} onDismiss={clearError} />}

      <section className="settings-section">
        <h2>Preferences</h2>
        <form className="settings-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="default-city">Default City</label>
            <input
              id="default-city"
              type="text"
              value={defaultCity}
              onChange={(event) => {
                setDefaultCity(event.target.value)
                setSaved(false)
              }}
              placeholder="e.g. London"
            />
            <p className="form-hint">
              This city loads automatically when you open the app.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="units">Temperature Units</label>
            <select
              id="units"
              value={preferences.units}
              onChange={handleUnitsChange}
            >
              <option value="metric">Celsius (°C)</option>
              <option value="imperial">Fahrenheit (°F)</option>
            </select>
          </div>

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save & Refresh'}
          </button>

          {saved && !error && (
            <p className="form-success" role="status">
              Preferences saved successfully.
            </p>
          )}
        </form>
      </section>

      <section className="settings-section settings-section--about">
        <h2>About SkyCast</h2>
        <div className="about-card">
          <p>
            SkyCast is a modern weather application built with React and the
            Context API. It provides real-time weather data powered by{' '}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenWeatherMap
            </a>
            .
          </p>
          <ul className="about-list">
            <li>Global city search with instant results</li>
            <li>Detailed metrics: humidity, wind, pressure, and more</li>
            <li>Responsive design for mobile and desktop</li>
            <li>Robust error handling for network and API failures</li>
          </ul>
          <p className="about-version">Version 1.0.0</p>
        </div>
      </section>
    </div>
  )
}

export default memo(Settings)
