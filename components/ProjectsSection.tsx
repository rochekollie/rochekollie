
export default function ProjectsSection() {
  const projects = [
    {
      title: 'Epael.com',
      badge: 'Web Application',
      link: 'https://epael.com',
      caseStudyLink: '#contact-wrapper',
      desc: 'A modern, high-performance web platform engineered for streamlined digital workflows, fast load times, and an intuitive user-centric interface.',
    },
    {
      title: 'CleverHigh.org',
      badge: 'EdTech Hub',
      link: 'https://cleverhigh.org',
      caseStudyLink: '#contact-wrapper',
      desc: 'An innovative education platform delivering structured learning pathways, interactive digital resources, and empowering tools for students and educators.',
    },
    {
      title: 'Whizzkid.org',
      badge: 'Interactive Learning',
      link: 'https://whizzkid.org',
      caseStudyLink: '#contact-wrapper',
      desc: 'An engaging, accessible educational web application crafted for young learners with gamified modules, cheerful responsive animations, and strict accessibility standards.',
    },
  ];

  return (
    <section id="projects-wrapper" className="content-section">
      <div id="case-studies" style={{position: 'relative', top: '-70px', visibility: 'hidden'}} />
      <div className="section-container">
        <div className="section-header text-center">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-desc">Selected work highlighting web development, UI engineering, and design solutions.</p>
        </div>

        <div className="projects-grid">
          {projects.map((proj) => (
            <article key={proj.title} className="project-card">
              <div className="project-badge">{proj.badge}</div>
              <h3 className="project-title">{proj.title}</h3>
              <p className="project-desc">{proj.desc}</p>
              <div className="project-actions">
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-project btn-project-primary"
                >
                  <span>View Project</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    viewBox="0 0 24 24"
                    width="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
                <a
                  href={proj.caseStudyLink}
                  className="btn-project btn-project-secondary"
                >
                  <span>Case Study</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    viewBox="0 0 24 24"
                    width="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
