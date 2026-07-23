import { memo, useEffect } from 'react'
import { useWeather } from '../context/WeatherContext.jsx'
import SearchBar from '../components/SearchBar.jsx'
import WeatherOverview from '../components/WeatherOverview.jsx'
import ErrorAlert from '../components/ErrorAlert.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

function Home() {
  const {
    weather,
    loading,
    error,
    preferences,
    searchCity,
    clearError,
  } = useWeather()

  useEffect(() => {
    if (!weather && !loading && !error) {
      searchCity(preferences.defaultCity).catch(() => {})
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page page--home">
      <div className="page__intro">
        <h1>Current Weather</h1>
        <p className="page__subtitle">
          Search any city worldwide for live conditions and forecasts.
        </p>
      </div>

      <SearchBar autoFocus />

      {error && <ErrorAlert error={error} onDismiss={clearError} />}

      {loading && !weather ? (
        <LoadingSpinner />
      ) : (
        <WeatherOverview weather={weather} units={preferences.units} />
      )}
    </div>
  )
}

export default memo(Home)
