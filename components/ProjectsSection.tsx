import React from 'react';

export default function ProjectsSection() {
  const projects = [
    {
      title: 'WhizzyKid',
      badge: 'Featured',
      desc: 'An engaging and interactive educational web application engineered for young learners with accessible navigation, dynamic modules, and cheerful animations.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'React'],
      date: 'Sept 2021',
    },
    {
      title: 'Restaurant Experience',
      badge: 'Design & Layout',
      desc: 'A responsive modern restaurant menu and ordering experience modeled with flexible CSS layouts, mouthwatering imagery, and smooth category filtering.',
      tags: ['CSS Flexbox', 'TypeScript', 'Responsive'],
      date: 'Sept 2021',
    },
    {
      title: 'Beyond These Walls',
      badge: 'Art & Culture',
      desc: 'A storytelling single-page web experience showcasing the public art mural project in Portsmouth, Ohio, featuring rich narrative sections and responsive imagery.',
      tags: ['Semantic HTML', 'CSS Grid', 'Typography'],
      date: 'Oct 2021',
    },
    {
      title: 'Mount Nimba Reserve',
      badge: 'UNESCO Site',
      desc: 'An immersive digital showcase for the UNESCO World Heritage Site utilizing HiDPI responsive switching, fine typography, and media queries to present ecological beauty.',
      tags: ['HiDPI Switching', 'CSS3', 'Modern JS'],
      date: 'Oct 2021',
    },
  ];

  return (
    <section id="projects-wrapper" className="content-section">
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
              <div className="project-meta">
                <div className="tag-group">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="project-date">{proj.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
