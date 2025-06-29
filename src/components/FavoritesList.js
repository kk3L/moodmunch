"use client"

import { useState } from "react"
import { Heart, ChevronDown, ChevronRight, BookOpen, Trash2 } from "lucide-react"

const FavoritesList = ({ favorites, removeFromFavorites }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="feature-card favorites-card">
      <h2 className="feature-title">
        <Heart className="feature-icon" size={24} />
        My Favorites ({favorites.length})
      </h2>

      {favorites.length === 0 ? (
        <p className="empty-favorites">No favorites yet! Start saving meals you love.</p>
      ) : (
        <>
          <button className="expand-button" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {isExpanded ? "Hide" : "Show"} Favorites
          </button>

          {isExpanded && (
            <div className="favorites-list">
              {favorites.map((meal) => (
                <div key={meal.id} className="favorite-item">
                  <div className="favorite-info">
                    <h4>{meal.name}</h4>
                    <p>{meal.description}</p>
                  </div>
                  <div className="favorite-actions">
                    <a href={meal.recipeUrl} target="_blank" rel="noopener noreferrer" className="recipe-link">
                      <BookOpen size={16} />
                    </a>
                    <button className="remove-btn" onClick={() => removeFromFavorites(meal.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FavoritesList
