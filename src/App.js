"use client"

import { useState, useEffect } from "react"
import "./App.css"
import MoodSelector from "./components/MoodSelector"
import WeatherSuggestions from "./components/WeatherSuggestions"
import RandomMeal from "./components/RandomMeal"
import FavoritesList from "./components/FavoritesList"
import Header from "./components/Header"
import Footer from "./components/Footer"

function App() {
  const [theme, setTheme] = useState("light")
  const [selectedMood, setSelectedMood] = useState("")
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const savedTheme = localStorage.getItem("moodmunch-theme")
    const savedFavorites = localStorage.getItem("moodmunch-favorites")

    if (savedTheme) {
      setTheme(savedTheme)
    }

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("moodmunch-theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("moodmunch-favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const addToFavorites = (meal) => {
    if (!favorites.find((fav) => fav.id === meal.id)) {
      setFavorites([...favorites, meal])
    }
  }

  const removeFromFavorites = (mealId) => {
    setFavorites(favorites.filter((fav) => fav.id !== mealId))
  }

  return (
    <div className="App">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-logo">
            <img
              src={theme === "light" ? "/moodmunch-logo.png" : "/moodmunch-logo-dark.png"}
              alt="MoodMunch"
              className="hero-logo-image"
            />
          </div>
          <p className="app-subtitle">
            Get food suggestions based on your mood, weather, or pure randomness — because decision fatigue is real!
          </p>
        </div>

        <div className="features-grid">
          <MoodSelector selectedMood={selectedMood} setSelectedMood={setSelectedMood} addToFavorites={addToFavorites} />

          <WeatherSuggestions addToFavorites={addToFavorites} />

          <RandomMeal addToFavorites={addToFavorites} />

          <FavoritesList favorites={favorites} removeFromFavorites={removeFromFavorites} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
