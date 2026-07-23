import { memo } from 'react'
import { Link } from 'react-router-dom'
import {
  capitalize,
  formatTemperature,
} from '../utils/formatters.js'
import WeatherIcon from './WeatherIcon.jsx'

function WeatherOverview({ weather, units }) {
  if (!weather) {
    return (
      <section className="weather-overview weather-overview--empty">
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">
            🌤
          </span>
          <h2>Welcome to SkyCast</h2>
          <p>Search for a city above to see current weather conditions.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="weather-overview">
      <div className="weather-overview__header">
        <div>
          <h2>
            {weather.city}
            {weather.country && (
              <span className="weather-overview__country">, {weather.country}</span>
            )}
          </h2>
          <p className="weather-overview__description">
            {capitalize(weather.description)}
          </p>
        </div>
        <WeatherIcon icon={weather.icon} description={weather.description} />
      </div>

      <p className="weather-overview__temp">
        {formatTemperature(weather.temperature, units)}
      </p>
      <p className="weather-overview__feels">
        Feels like {formatTemperature(weather.feelsLike, units)}
      </p>

      <div className="weather-overview__range">
        <span>H: {formatTemperature(weather.tempMax, units)}</span>
        <span>L: {formatTemperature(weather.tempMin, units)}</span>
      </div>

      <Link to="/details" className="btn btn--secondary">
        View detailed metrics →
      </Link>
    </section>
  )
}

export default memo(WeatherOverview)
