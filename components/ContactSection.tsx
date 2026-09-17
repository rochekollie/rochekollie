'use client';

import React, { useState } from 'react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    e.currentTarget.reset();
  };

  return (
    <section id="contact-wrapper" className="content-section">
      <div className="section-container contact-container">
        <div className="section-header text-center">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-desc">I am always open to new opportunities, collaborations, and conversations.</p>
        </div>

        <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
          {submitted && (
            <div
              style={{
                padding: '0.85rem 1.25rem',
                marginBottom: '1.25rem',
                backgroundColor: 'rgba(0, 255, 217, 0.12)',
                border: '1px solid var(--neon-cyan)',
                borderRadius: '8px',
                color: 'var(--neon-cyan)',
                fontSize: '0.95rem',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              🎉 Thank you for reaching out! Roche will get back to you shortly.
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" type="text" placeholder="Your name" required />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" placeholder="your.email@example.com" required />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" rows={5} placeholder="Write something nice..." required />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
