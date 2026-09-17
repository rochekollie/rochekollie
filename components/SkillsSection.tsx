import React from 'react';

export default function SkillsSection() {
  const skills = [
    {
      title: 'UI/UX Design',
      desc: 'I craft intuitive, accessible, and dynamic interfaces with modern aesthetic appeal. Experienced in rapid prototyping, wireframing, responsive layouts, and user-centered design systems.',
      tags: ['Figma', 'Design Systems', 'Responsive UI', 'Accessibility'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.64 10.6 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
        </svg>
      ),
    },
    {
      title: 'Frontend Engineering',
      desc: 'Building performant, interactive web applications using modern React, Next.js, TypeScript, and CSS architecture. Obsessed with snappy Core Web Vitals and polished interactions.',
      tags: ['React', 'Next.js', 'TypeScript', 'Tailwind/Modern CSS'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36" fill="currentColor">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
        </svg>
      ),
    },
    {
      title: 'Backend Architecture',
      desc: 'Developing scalable RESTful and microservice backend APIs using Node.js, Express, Python, and cloud services. Focused on robust data models, security best practices, and high throughput.',
      tags: ['Node.js', 'REST APIs', 'Python', 'Databases'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="skills-wrapper" className="content-section">
      <div className="section-container">
        <div className="section-header text-center">
          <h2 className="section-title">Things I Do</h2>
          <p className="section-desc">Full-cycle product engineering from conception to production delivery.</p>
        </div>

        <div className="cards-grid">
          {skills.map((skill) => (
            <div key={skill.title} className="card skill-card">
              <div className="card-icon">{skill.icon}</div>
              <h3 className="card-title">{skill.title}</h3>
              <p className="card-text">{skill.desc}</p>
              <div className="tag-group">
                {skill.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
