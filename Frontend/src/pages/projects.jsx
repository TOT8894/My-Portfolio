import './projects.css'

export const Projects = () => {
const projects = [
  {
    title: "E-Commerce Platform",
    description: "A scalable online shopping platform designed to help businesses manage products, users, and transactions in one system. It enables customers to browse products, securely authenticate, add items to a cart, and complete purchases through integrated payment processing, while administrators control inventory, orders, and overall store operations through a centralized dashboard.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    demoLink: "#",
    githubLink: "https://github.com/TOT8894?tab=repositories",
    featured: true
  },
  {
    title: "Employee Task Manager",
    description: "A collaborative task management system built to improve team productivity and workflow transparency. It allows teams to organize tasks within shared workspaces, track progress in real time, and manage task lifecycles through an interactive board, ensuring better coordination, accountability, and efficient project execution.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Rest APIs"],
    demoLink: "#",
    githubLink: "https://github.com/TOT8894?tab=repositories",
    featured: true
  },
  {
    title: "Portfolio Website",
    description: "A modern personal portfolio platform created to showcase skills, projects, and professional identity through an interactive and responsive interface. It delivers a smooth user experience with dynamic content rendering, theme customization, and seamless navigation, helping present technical expertise in a visually engaging and accessible way.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Rest APIs"],
    demoLink: "#",
    githubLink: "https://github.com/TOT8894?tab=repositories",
    featured: true
  },
  {
    title: "Weather Dashboard",
    description: "A real-time weather information system designed to provide users with accurate and location-based forecasts. It retrieves and processes external data to display current conditions and future weather trends, enabling users to make informed decisions based on up-to-date environmental insights.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Rest APIs"],
    demoLink: "#",
    githubLink: "https://github.com/TOT8894?tab=repositories",
    featured: false
  },
  {
    title: "Smart Healthcare System",
    description: "A digital communication platform developed to enhance interaction between users through real-time messaging and data exchange. It supports continuous communication, information sharing, and user presence awareness, making it suitable for scenarios that require instant collaboration such as healthcare consultations or team coordination.",
    technologies: ["Node.js", "Socket.io", "Express", "MongoDB", "React", "Rest APIs"],
    demoLink: "#",
    githubLink: "https://github.com/TOT8894?tab=repositories",
    featured: false
  }
];

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <h2 className="section-title">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="section-subtitle">Some of my recent work</p>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={`project-card ${project.featured ? 'featured' : ''}`}
            >
              <div className="project-content">
                <div className="project-header">
                  <div className="project-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  {project.featured && <span className="featured-badge">Featured</span>}
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-techs">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  <a 
                    href={project.demoLink} 
                    className="project-link demo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live Demo
                  </a>
                  <a 
                    href={project.githubLink} 
                    className="project-link github"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="projects-cta">
          <a 
            href="https://github.com/TOT8894?tab=repositories" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            View All Projects
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
