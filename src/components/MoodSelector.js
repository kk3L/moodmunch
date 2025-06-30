"use client"

import { useState } from "react"
import { getMoodBasedMeals } from "../data/mealData"
import { Brain, Salad, DollarSign, Sparkles, Heart, Flame, RefreshCw, BookOpen } from "lucide-react"

const MoodSelector = ({ selectedMood, setSelectedMood, addToFavorites }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [meals, setMeals] = useState([])
  const [currentSuggestion, setCurrentSuggestion] = useState(null)

  const moods = [
    { value: "lazy", label: "Lazy", icon: Brain },
    { value: "healthy", label: "Healthy", icon: Salad },
    { value: "broke", label: "Broke", icon: DollarSign },
    { value: "fancy", label: "Fancy", icon: Sparkles },
    { value: "comfort", label: "Comfort", icon: Heart },
    { value: "adventurous", label: "Adventurous", icon: Flame },
  ]

  const handleMoodChange = async (mood) => {
    setSelectedMood(mood)
    setIsLoading(true)

    try {
      const moodMeals = await getMoodBasedMeals(mood)
      setMeals(moodMeals)

      if (moodMeals.length > 0) {
        const randomMeal = moodMeals[Math.floor(Math.random() * moodMeals.length)]
        setCurrentSuggestion(randomMeal)
      }
    } catch (error) {
      console.error("Error fetching mood meals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAnotherSuggestion = () => {
    if (meals.length > 0) {
      const randomMeal = meals[Math.floor(Math.random() * meals.length)]
      setCurrentSuggestion(randomMeal)
    }
  }

  return (
    <div className="feature-card">
      <h2 className="feature-title">
        <Brain className="feature-icon" size={24} />
        I'm feeling...
      </h2>

      <div className="mood-grid">
        {moods.map((mood) => {
          const IconComponent = mood.icon
          return (
            <button
              key={mood.value}
              className={`mood-button ${selectedMood === mood.value ? "active" : ""}`}
              onClick={() => handleMoodChange(mood.value)}
              disabled={isLoading}
            >
              <IconComponent className="mood-icon" size={24} />
              <span className="mood-label">{mood.label}</span>
            </button>
          )
        })}
      </div>

      {!selectedMood && !isLoading && (
        <p className="selection-prompt">Pick a mood to discover perfect meals for you!</p>
      )}

      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Finding perfect meals for your mood...</p>
        </div>
      )}

      {currentSuggestion && selectedMood && !isLoading && (
        <div className="suggestion-card">
          {currentSuggestion.image && (
            <img
              src={currentSuggestion.image || "/placeholder.svg"}
              alt={currentSuggestion.name}
              className="suggestion-image"
            />
          )}
          <h3>{currentSuggestion.name}</h3>
          <p>{currentSuggestion.description}</p>

          {(currentSuggestion.readyInMinutes || currentSuggestion.servings) && (
            <div className="recipe-meta">
              {currentSuggestion.readyInMinutes && (
                <span className="meta-item">⏱️ {currentSuggestion.readyInMinutes} min</span>
              )}
              {currentSuggestion.servings && (
                <span className="meta-item">👥 {currentSuggestion.servings} servings</span>
              )}
            </div>
          )}

          <div className="suggestion-actions">
            <button className="favorite-btn" onClick={() => addToFavorites(currentSuggestion)}>
              <Heart size={16} />
              Save
            </button>
            <a href={currentSuggestion.recipeUrl} target="_blank" rel="noopener noreferrer" className="recipe-btn">
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

export default MoodSelector
