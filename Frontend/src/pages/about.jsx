import './about.css'
import image from "../assets/profile.jpg"

export const About = () => {

  const education = [
    {
      student: "Software Engineering Student",
      school: "Addis Ababa Science and Technology University",
      year: "2024 - Present",
      description: "Focused on software development, and modern web technologies."
    }
  ]

  const highlights = [
    "Strong foundation in JavaScript, React, Node.js, and MongoDB",
    "Experience building responsive and user-friendly web applications",
    "Familiar with RESTful API development and integration",
    "Knowledge of version control using Git and GitHub",
    "Quick learner with a passion for continuous improvement",
    "Team work and collaboration skills, with experience working on group projects",
  ]

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="section-title">
          About <span className="gradient-text">Me</span>
        </h2>
        <p className="section-subtitle">Get to know the person behind the code</p>

        <div className="about-content">
          
          {/* IMAGE */}
          <div className="about-image-wrapper">
            <div className="about-image">
              <img className='img' src={image} alt="Profile" />
            </div>
            <div className="image-decoration"></div>
          </div>

          {/* INFO */}
          <div className="about-info">
            
            <h3 className="about-heading">Profile</h3>

            <p className="about-text">
              I am a passionate junior Full Stack Developer with a solid foundation in building modern web applications using JavaScript, React, Node.js, and MongoDB. I focus on creating clean, responsive, and user-friendly interfaces while also developing efficient backend systems.
            </p>

            <p className="about-text">
              As a beginner in the professional field, I am actively strengthening my skills by working on real-world projects and continuously learning new technologies. I enjoy solving problems, writing maintainable code, and collaborating with others to build meaningful digital solutions.
            </p>

            {/* EDUCATION */}
            <h3 className="about-heading">Education</h3>
            <div className="education-list">
              {education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="edu-dot"></div>
                  <div className="edu-content">
                    <h4>{edu.student}</h4>
                    <p className="edu-school">{edu.school}</p>
                    <span className="edu-year">{edu.year}</span>
                    <p className="edu-desc">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* HIGHLIGHTS */}
            <h3 className="about-heading">Key Highlights</h3>
            <ul className="highlights-list">
              {highlights.map((highlight, index) => (
                <li key={index} className="highlight-item">
                  <span className="check-icon">✓</span>
                  {highlight}
                </li>
              ))}
            </ul>

            {/* DOWNLOAD CV */}
            <a 
              href="/resume.pdf" 
              className="btn-primary download-btn"
              download
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </a>

          </div>
        </div>
      </div>
    </section>
  )
}