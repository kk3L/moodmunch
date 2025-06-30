"use client"

import { useState } from "react"
import { getRandomMeal } from "../data/mealData"
import { Dice6, Target, Heart, BookOpen } from "lucide-react"

const RandomMeal = ({ addToFavorites }) => {
  const [randomSuggestion, setRandomSuggestion] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const generateRandomMeal = async () => {
    setIsSpinning(true)

    try {
      const meal = await getRandomMeal()

      // Add a minimum delay for better UX
      setTimeout(() => {
        if (meal) {
          setRandomSuggestion(meal)
        }
        setIsSpinning(false)
      }, 1500)
    } catch (error) {
      console.error("Error fetching random meal:", error)
      setIsSpinning(false)
    }
  }

  return (
    <div className="feature-card">
      <h2 className="feature-title">
        <Dice6 className="feature-icon" size={24} />
        Surprise Me!
      </h2>

      <p className="feature-description">Can't decide? Let fate choose your next meal!</p>
      <p className="selection-prompt">Click the button below to get a surprise meal recommendation!</p>

      <button
        className={`random-button ${isSpinning ? "spinning" : ""}`}
        onClick={generateRandomMeal}
        disabled={isSpinning}
      >
        <Target className={`random-icon ${isSpinning ? "spinning" : ""}`} size={20} />
        {isSpinning ? "Choosing..." : "Random Meal"}
      </button>

      {randomSuggestion && !isSpinning && (
        <div className="suggestion-card">
          {randomSuggestion.image && (
            <img
              src={randomSuggestion.image || "/placeholder.svg"}
              alt={randomSuggestion.name}
              className="suggestion-image"
            />
          )}
          <h3>{randomSuggestion.name}</h3>
          <p>{randomSuggestion.description}</p>

          {(randomSuggestion.readyInMinutes || randomSuggestion.servings) && (
            <div className="recipe-meta">
              {randomSuggestion.readyInMinutes && (
                <span className="meta-item">⏱️ {randomSuggestion.readyInMinutes} min</span>
              )}
              {randomSuggestion.servings && <span className="meta-item">👥 {randomSuggestion.servings} servings</span>}
            </div>
          )}

          <div className="suggestion-actions">
            <button className="favorite-btn" onClick={() => addToFavorites(randomSuggestion)}>
              <Heart size={16} />
              Save
            </button>
            <a href={randomSuggestion.recipeUrl} target="_blank" rel="noopener noreferrer" className="recipe-btn">
              <BookOpen size={16} />
              Recipe
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default RandomMeal
