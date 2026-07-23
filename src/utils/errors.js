export class WeatherError extends Error {
  constructor(message, type = 'unknown') {
    super(message)
    this.name = 'WeatherError'
    this.type = type
  }
}

export function parseWeatherError(error) {
  if (error instanceof WeatherError) {
    return error
  }

  if (error instanceof TypeError || error.name === 'AbortError') {
    return new WeatherError(
      'Unable to reach the weather service. Check your internet connection and try again.',
      'network',
    )
  }

  return new WeatherError(
    'Something went wrong while fetching weather data. Please try again.',
    'unknown',
  )
}

export function parseApiError(status, data) {
  switch (status) {
    case 404:
      return new WeatherError(
        'City not found. Please check the spelling and try again.',
        'not_found',
      )
    case 401:
      return new WeatherError(
        'Invalid API key. Please verify your OpenWeatherMap credentials.',
        'auth',
      )
    case 429:
      return new WeatherError(
        'Too many requests. Please wait a moment before searching again.',
        'rate_limit',
      )
    default:
      return new WeatherError(
        data?.message || 'The weather service returned an unexpected error.',
        'api',
      )
  }
}
