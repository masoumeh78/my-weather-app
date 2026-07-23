export function formatTemperature(value, units = 'metric') {
  if (value == null || Number.isNaN(value)) return '—'
  const rounded = Math.round(value)
  return units === 'imperial' ? `${rounded}°F` : `${rounded}°C`
}

export function formatWindSpeed(speed, units = 'metric') {
  if (speed == null || Number.isNaN(speed)) return '—'
  return units === 'imperial' ? `${speed.toFixed(1)} mph` : `${speed.toFixed(1)} m/s`
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return `${value}%`
}

export function formatVisibility(meters, units = 'metric') {
  if (meters == null || Number.isNaN(meters)) return '—'
  if (units === 'imperial') {
    return `${(meters / 1609.34).toFixed(1)} mi`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatPressure(hPa) {
  if (hPa == null || Number.isNaN(hPa)) return '—'
  return `${hPa} hPa`
}

export function formatDate(timestamp) {
  if (!timestamp) return '—'
  return new Date(timestamp * 1000).toLocaleString(undefined, {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function capitalize(text) {
  if (!text) return ''
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
