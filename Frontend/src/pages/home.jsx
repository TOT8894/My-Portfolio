import { useState, useEffect } from 'react'
import './home.css'

export const Home = () => {
  const [text, setText] = useState('')
  const fullText = "Backend Developer"
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorTimer)
  }, [])

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="home-section">
      {/* Background effects */}
      <div className="bg-effects">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="home-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
                    Ready For Intership
        </div>

        <h1 className="hero-title">
          Hi, I'm <span className="gradient-text">Shanbel Dires</span>
        </h1>

        <h2 className="hero-subtitle">
          {text}
          <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
        </h2>

        <p className="hero-description">
          Building elegant solutions with modern technologies. 
          Passionate about creating exceptional digital experiences.
        </p>

        <div className="hero-buttons">
          <button 
            className="btn-primary"
            onClick={() => scrollToSection('#projects')}
          >
            View Projects
          </button>
          <button 
            className="btn-secondary"
            onClick={() => scrollToSection('#contact')}
          >
            Contact Me
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">Experience</span>
            <span className="stat-label">Intermidiate </span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Projects Completed</span>
          </div>
        </div>
      </div>

      <div className="scroll-indicator" onClick={() => scrollToSection('#about')}>
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
    </section>
  )
}