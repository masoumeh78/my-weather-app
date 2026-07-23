import { parseApiError, WeatherError } from '../utils/errors.js'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'
const REQUEST_TIMEOUT_MS = 10000
const SUGGESTION_LIMIT = 6

function getApiKey() {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!key || key === 'your_api_key_here') {
    throw new WeatherError(
      'Weather API key is missing. Add VITE_OPENWEATHER_API_KEY to your .env file.',
      'config',
    )
  }
  return key
}

function normalizeWeatherResponse(data) {
  if (!data || !data.main || !data.weather?.length) {
    throw new WeatherError(
      'Received an incomplete response from the weather service.',
      'empty',
    )
  }

  return {
    city: data.name,
    country: data.sys?.country ?? '',
    coordinates: {
      lat: data.coord?.lat,
      lon: data.coord?.lon,
    },
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    windSpeed: data.wind?.speed ?? 0,
    windDirection: data.wind?.deg ?? 0,
    cloudiness: data.clouds?.all ?? 0,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    sunrise: data.sys?.sunrise,
    sunset: data.sys?.sunset,
    timezone: data.timezone,
    updatedAt: data.dt,
  }
}

export async function fetchWeatherByCity(city, units = 'metric') {
  const trimmedCity = city?.trim()
  if (!trimmedCity) {
    throw new WeatherError('Please enter a city name to search.', 'validation')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const params = new URLSearchParams({
      q: trimmedCity,
      appid: getApiKey(),
      units,
    })

    const response = await fetch(`${BASE_URL}?${params}`, {
      signal: controller.signal,
    })

    let data = null
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      data = await response.json()
    }

    if (!response.ok) {
      throw parseApiError(response.status, data)
    }

    if (!data || Object.keys(data).length === 0) {
      throw new WeatherError(
        'The weather service returned an empty response.',
        'empty',
      )
    }

    return normalizeWeatherResponse(data)
  } finally {
    clearTimeout(timeoutId)
  }
}

function normalizeCitySuggestion(item) {
  const parts = [item.name]
  if (item.state) parts.push(item.state)
  if (item.country) parts.push(item.country)

  return {
    id: `${item.name}-${item.country}-${item.lat}-${item.lon}`,
    name: item.name,
    state: item.state ?? '',
    country: item.country ?? '',
    lat: item.lat,
    lon: item.lon,
    label: parts.join(', '),
    query: item.country ? `${item.name},${item.country}` : item.name,
  }
}

export async function fetchCitySuggestions(
  query,
  { limit = SUGGESTION_LIMIT, signal } = {},
) {
  const trimmed = query?.trim()
  if (!trimmed || trimmed.length < 2) return []

  try {
    const params = new URLSearchParams({
      q: trimmed,
      limit: String(limit),
      appid: getApiKey(),
    })

    const response = await fetch(`${GEO_URL}?${params}`, { signal })

    if (!response.ok) return []

    const data = await response.json()
    if (!Array.isArray(data) || data.length === 0) return []

    return data.map(normalizeCitySuggestion)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    return []
  }
}
