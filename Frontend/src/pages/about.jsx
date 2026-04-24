import './about.css'
import image from "../assets/profile.jpg"

import './about.css'

export const About = () => {
//   const education = [
//     {
//       degree: "Bachelor of Science in Computer Science",
//       school: "Addis Ababa University",
//       year: "2019 - 2023",
//       description: "Specialized in Software Engineering and Web Development"
//     },
//     {
//       degree: "Full Stack Web Development Certification",
//       school: "Coursera & Udemy",
//       year: "2022 - 2023",
//       description: "Intensive training in modern web technologies"
//     }
//   ]

  const highlights = [
    "Proficient in JavaScript, React, Node.js, and MongoDB",
    "Experience with RESTful APIs, Git, and Agile methodologies",
    "Strong problem-solving skills and attention to detail",
    "Excellent communication and teamwork abilities",
    "Passionate about learning new technologies and improving skills"
  ]

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="section-title">
          About <span className="gradient-text">Me</span>
        </h2>
        <p className="section-subtitle">Get to know the person behind the code</p>

        <div className="about-content">
          <div className="about-image-wrapper">
            <div className="about-image">
                <img className='img' src={image} alt="Profile Image" />
            </div>
            <div className="image-decoration"></div>
          </div>

          <div className="about-info">
            <h3 className="about-heading">Professional Summary</h3>
            <p className="about-text">
              hello
            </p>
            <p className="about-text">
             hello
            </p>

            <h3 className="about-heading">Education</h3>
            {/* <div className="education-list">
              {education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="edu-dot"></div>
                  <div className="edu-content">
                    <h4>{edu.degree}</h4>
                    <p className="edu-school">{edu.school}</p>
                    <span className="edu-year">{edu.year}</span>
                    <p className="edu-desc">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div> */}

            <h3 className="about-heading">Key Highlights</h3>
            <ul className="highlights-list">
              {highlights.map((highlight, index) => (
                <li key={index} className="highlight-item">
                  <span className="check-icon">✓</span>
                  {highlight}
                </li>
              ))}
            </ul>

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