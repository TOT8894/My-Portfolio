import { useState, useEffect, useRef } from 'react'
import './skill.css'

export const Skill = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const skillCategories = [
    {
      title: "Frontend",
      icon: "🎨",
      skills: [
        { name: "React", level: 75 },
        { name: "JavaScript", level: 90 },
        { name: "HTML", level: 95 },
        { name: "CSS", level: 95 }
      ]
    },
    {
      title: "Backend",
      icon: "⚙️",
      skills: [
        { name: "Node.js", level: 85 },
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="skills-section">
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
                  const delay = (catIndex * 5 + skillIndex) * 100

                  return (
                    <div key={skillIndex} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percentage">{skill.level}%</span>
                      </div>

                      <div className="skill-progress">
                        <div
                          className="skill-progress-fill"
                          style={{
                            width: isVisible ? `${skill.level}%` : '0%',
                            transition: `width 1s ease ${delay}ms`
                          }}
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