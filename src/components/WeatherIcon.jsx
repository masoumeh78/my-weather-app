import { memo } from 'react'

function WeatherIcon({ icon, description, size = 'large' }) {
  if (!icon) return null

  const src = `https://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <img
      className={`weather-icon weather-icon--${size}`}
      src={src}
      alt={description || 'Weather condition'}
      loading="lazy"
    />
  )
}

export default memo(WeatherIcon)
