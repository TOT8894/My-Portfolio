import { useState, useEffect } from 'react'
import './home.css'

export const Home = () => {
  const [text, setText] = useState('')
  const fullText = "Junior Full Stack Developer"
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

        {/* STATUS BADGE */}
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Open to Internship Opportunities
        </div>

        {/* NAME */}
        <h1 className="hero-title">
          Hi, I'm <span className="gradient-text">Shanbel Dires</span>
        </h1>

        {/* ROLE */}
        <h2 className="hero-subtitle">
          {text}
          <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
        </h2>

        {/* PROFESSIONAL DESCRIPTION */}
        <p className="hero-description">
          I build scalable and user-focused web applications using modern technologies. <br />
          Passionate about contributing to the digital ecosystem by developing efficient, <br />
          reliable, and impactful software solutions that solve real-world problems.<br />
        </p>

        {/* BUTTONS */}
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

        {/* STATS */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">Level</span>
            <span className="stat-label">Junior Developer</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Projects Completed</span>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="scroll-indicator" onClick={() => scrollToSection('#about')}>
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
    </section>
  )
}