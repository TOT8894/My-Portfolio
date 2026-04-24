import { useState, useEffect } from 'react'
import './skill.css'

export const Skill = () => {
  const [animatedSkills, setAnimatedSkills] = useState({})

  const skillCategories = [
    {
      title: "Frontend",
      icon: "🎨",
      skills: [
        { name: "React", level: 75 },
        { name: "JavaScript", level: 90 },
        { name: "HTML/CSS", level: 95 }
      ]
    },
    {
      title: "Backend",
      icon: "⚙️",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Python", level: 80 },
        { name: "Express", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "REST APIs", level: 90 },
      ]
    },
    {
      title: "Tools & Technologies",
      icon: "🛠️",
      skills: [
        { name: "Git", level: 85 },
        { name: "Github", level: 70 },
        { name: "VS Code", level: 95 },
        { name: "Figma", level: 75 },
        { name: "Postman", level: 85 },
      ]
    },
    {
      title: "Soft Skills",
      icon: "💡",
      skills: [
        { name: "Problem Solving", level: 70 },
        { name: "Communication", level: 85 },
        { name: "Team Work", level: 90 },
        { name: "Time Management", level: 85 },
      ]
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const skillBars = document.querySelectorAll('.skill-progress-fill')
      skillBars.forEach((bar, index) => {
        const rect = bar.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8) {
          setTimeout(() => {
            setAnimatedSkills(prev => ({ ...prev, [index]: true }))
          }, index * 100)
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        <h2 className="section-title">
          My <span className="gradient-text">Skills</span>
        </h2>
        <p className="section-subtitle">Technologies and tools I work with</p>

        <div className="skills-grid">
          {skillCategories.map((category, catIndex) => (
            <div key={catIndex} className="skill-category">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3 className="category-title">{category.title}</h3>
              </div>

              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => {
                  const globalIndex = catIndex * 10 + skillIndex
                  const isAnimated = animatedSkills[globalIndex]
                  
                  return (
                    <div key={skillIndex} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percentage">{skill.level}%</span>
                      </div>
                      <div className="skill-progress">
                        <div 
                          className="skill-progress-fill"
                          style={{ width: isAnimated ? `${skill.level}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}