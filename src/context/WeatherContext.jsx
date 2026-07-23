import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { fetchWeatherByCity } from '../services/weatherApi.js'
import { parseWeatherError } from '../utils/errors.js'

const STORAGE_KEY = 'weather-app-preferences'

const defaultPreferences = {
  units: 'metric',
  defaultCity: 'London',
}

function loadPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultPreferences
    return { ...defaultPreferences, ...JSON.parse(stored) }
  } catch {
    return defaultPreferences
  }
}

const initialState = {
  weather: null,
  loading: false,
  error: null,
  lastSearchedCity: '',
  preferences: loadPreferences(),
}

function weatherReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        weather: action.payload,
        lastSearchedCity: action.payload.city,
        error: null,
      }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      }
    default:
      return state
  }
}

const WeatherContext = createContext(null)

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState)
  const previousUnits = useRef(state.preferences.units)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.preferences))
  }, [state.preferences])

  useEffect(() => {
    if (previousUnits.current === state.preferences.units) return
    previousUnits.current = state.preferences.units

    const city = state.lastSearchedCity || state.preferences.defaultCity
    if (!city || !state.weather) return

    dispatch({ type: 'FETCH_START' })
    fetchWeatherByCity(city, state.preferences.units)
      .then((data) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch((error) =>
        dispatch({ type: 'FETCH_ERROR', payload: parseWeatherError(error) }),
      )
  }, [state.preferences.units, state.lastSearchedCity, state.preferences.defaultCity, state.weather])

  const searchCity = useCallback(
    async (city) => {
      dispatch({ type: 'FETCH_START' })
      try {
        const data = await fetchWeatherByCity(city, state.preferences.units)
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
        return data
      } catch (error) {
        const weatherError = parseWeatherError(error)
        dispatch({ type: 'FETCH_ERROR', payload: weatherError })
        throw weatherError
      }
    },
    [state.preferences.units],
  )

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  const updatePreferences = useCallback((updates) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: updates })
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      searchCity,
      clearError,
      updatePreferences,
    }),
    [state, searchCity, clearError, updatePreferences],
  )

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWeather() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }
  return context
}
