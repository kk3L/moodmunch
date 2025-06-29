"use client"

import { ExternalLink, Code2 } from "lucide-react"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <p className="footer-text">© 2025 Kiel Salomon Ongtengco. All rights reserved.</p>

          <div className="footer-links">
            <a
              href="https://kielportfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-link"
            >
              <Code2 size={16} />
              View Portfolio
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-subtitle">Crafted with passion • Built with React • Powered by Spoonacular API</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
