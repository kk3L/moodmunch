"use client"

import { useState } from "react"
import { getWeatherBasedMeals } from "../data/mealData"
import { Sun, Snowflake, CloudRain, Cloud, Heart, BookOpen, RefreshCw } from "lucide-react"

const WeatherSuggestions = ({ setCurrentSuggestion, addToFavorites, currentSuggestion }) => {
  const [weather, setWeather] = useState("")
  const [suggestion, setSuggestion] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [meals, setMeals] = useState([])

  const weatherOptions = [
    { value: "hot", label: "Hot", icon: Sun },
    { value: "cold", label: "Cold", icon: Snowflake },
    { value: "rainy", label: "Rainy", icon: CloudRain },
    { value: "mild", label: "Mild", icon: Cloud },
  ]

  const handleWeatherChange = async (weatherType) => {
    setWeather(weatherType)
    setIsLoading(true)

    try {
      const weatherMeals = await getWeatherBasedMeals(weatherType)
      setMeals(weatherMeals)

      if (weatherMeals.length > 0) {
        const randomMeal = weatherMeals[Math.floor(Math.random() * weatherMeals.length)]
        setSuggestion(randomMeal)
        setCurrentSuggestion(randomMeal)
      }
    } catch (error) {
      console.error("Error fetching weather meals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAnotherSuggestion = () => {
    if (meals.length > 0) {
      const randomMeal = meals[Math.floor(Math.random() * meals.length)]
      setSuggestion(randomMeal)
      setCurrentSuggestion(randomMeal)
    }
  }

  // Remove the auto-initialization useEffect completely
  // The component will now start empty until user makes a selection

  return (
    <div className="feature-card">
      <h2 className="feature-title">
        <Cloud className="feature-icon" size={24} />
        Weather Vibes
      </h2>

      <div className="weather-grid">
        {weatherOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <button
              key={option.value}
              className={`weather-button ${weather === option.value ? "active" : ""}`}
              onClick={() => handleWeatherChange(option.value)}
              disabled={isLoading}
            >
              <IconComponent className="weather-icon" size={24} />
              <span className="weather-label">{option.label}</span>
            </button>
          )
        })}
      </div>

      {!weather && !isLoading && (
        <p className="selection-prompt">Choose a weather condition to get meal suggestions!</p>
      )}

      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Finding weather-perfect meals...</p>
        </div>
      )}

      {suggestion && !isLoading && (
        <div className="suggestion-card">
          {suggestion.image && (
            <img src={suggestion.image || "/placeholder.svg"} alt={suggestion.name} className="suggestion-image" />
          )}
          <h3>{suggestion.name}</h3>
          <p>{suggestion.description}</p>

          {(suggestion.readyInMinutes || suggestion.servings) && (
            <div className="recipe-meta">
              {suggestion.readyInMinutes && <span className="meta-item">⏱️ {suggestion.readyInMinutes} min</span>}
              {suggestion.servings && <span className="meta-item">👥 {suggestion.servings} servings</span>}
            </div>
          )}

          <div className="suggestion-actions">
            <button className="favorite-btn" onClick={() => addToFavorites(suggestion)}>
              <Heart size={16} />
              Save
            </button>
            <a href={suggestion.recipeUrl} target="_blank" rel="noopener noreferrer" className="recipe-btn">
              <BookOpen size={16} />
              Recipe
            </a>
            {meals.length > 1 && (
              <button className="another-btn" onClick={getAnotherSuggestion}>
                <RefreshCw size={16} />
                Another
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherSuggestions
