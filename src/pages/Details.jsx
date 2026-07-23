import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useWeather } from '../context/WeatherContext.jsx'
import MetricCard from '../components/MetricCard.jsx'
import WeatherIcon from '../components/WeatherIcon.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorAlert from '../components/ErrorAlert.jsx'
import {
  capitalize,
  formatDate,
  formatPercent,
  formatPressure,
  formatTemperature,
  formatVisibility,
  formatWindSpeed,
} from '../utils/formatters.js'

function windDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

function Details() {
  const { weather, loading, error, preferences, clearError } = useWeather()
  const units = preferences.units

  if (loading && !weather) {
    return <LoadingSpinner label="Loading weather details…" />
  }

  if (!weather) {
    return (
      <div className="page page--details">
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">
            📊
          </span>
          <h2>No weather data yet</h2>
          <p>Search for a city on the home page to view detailed metrics.</p>
          <Link to="/" className="btn btn--primary">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  const metrics = [
    { label: 'Humidity', value: formatPercent(weather.humidity), icon: '💧' },
    {
      label: 'Wind Speed',
      value: formatWindSpeed(weather.windSpeed, units),
      icon: '💨',
    },
    {
      label: 'Wind Direction',
      value: `${windDirection(weather.windDirection)} (${weather.windDirection}°)`,
      icon: '🧭',
    },
    { label: 'Pressure', value: formatPressure(weather.pressure), icon: '📉' },
    {
      label: 'Visibility',
      value: formatVisibility(weather.visibility, units),
      icon: '👁',
    },
    { label: 'Cloudiness', value: formatPercent(weather.cloudiness), icon: '☁' },
    {
      label: 'Feels Like',
      value: formatTemperature(weather.feelsLike, units),
      icon: '🌡',
    },
    {
      label: 'High / Low',
      value: `${formatTemperature(weather.tempMax, units)} / ${formatTemperature(weather.tempMin, units)}`,
      icon: '↕',
    },
  ]

  return (
    <div className="page page--details">
      {error && <ErrorAlert error={error} onDismiss={clearError} />}

      <div className="details-header">
        <div>
          <h1>Weather Details</h1>
          <p className="page__subtitle">
            {weather.city}, {weather.country} — {capitalize(weather.description)}
          </p>
        </div>
        <WeatherIcon
          icon={weather.icon}
          description={weather.description}
          size="medium"
        />
      </div>

      <div className="details-summary">
        <p className="details-summary__temp">
          {formatTemperature(weather.temperature, units)}
        </p>
        <div className="details-summary__sun">
          <span>🌅 Sunrise: {formatDate(weather.sunrise)}</span>
          <span>🌇 Sunset: {formatDate(weather.sunset)}</span>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <p className="details-updated">
        Last updated: {formatDate(weather.updatedAt)}
      </p>
    </div>
  )
}

export default memo(Details)
