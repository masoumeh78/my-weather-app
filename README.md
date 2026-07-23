# SkyCast — React Weather Application

A professional weather app built with React, Context API, and OpenWeatherMap. Search cities worldwide, view detailed metrics, and customize your experience.

## Features

- **Global city search** with real-time weather data
- **Context API** for global state (weather data, user preferences)
- **Three routes**: Home, Details, and Settings
- **Robust error handling** for invalid cities, network failures, and API errors
- **Responsive design** optimized for mobile and desktop
- **Code-split pages** with React.lazy for better performance

## Getting Started

### 1. Get an API Key

Sign up at [OpenWeatherMap](https://openweathermap.org/api) and create a free API key.

### 2. Configure Environment

Copy the example env file and add your key:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # WeatherContext (global state)
├── pages/          # Home, Details, Settings
├── services/       # OpenWeatherMap API integration
└── utils/          # Error handling & formatters
```

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run ESLint               |

## Tech Stack

- React 19
- React Router 7
- Vite 8
- OpenWeatherMap API
