"use client"

import { Moon, Sun } from "lucide-react"

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img
            src={theme === "light" ? "/moodmunch-logo.png" : "/moodmunch-logo-dark.png"}
            alt="MoodMunch"
            className="logo-image"
          />
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  )
}

export default Header
