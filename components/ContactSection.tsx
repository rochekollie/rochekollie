'use client';

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';

export default function ContactSection() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const writePromise = addDoc(collection(db, 'contacts'), {
        name,
        email,
        message,
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
        read: false,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore operation timed out.')), 4000)
      );

      await Promise.race([writePromise, timeoutPromise]);

      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err: unknown) {
      console.error('Error saving contact message to Firestore:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('Database') || errMsg.includes('not found') || errMsg.includes('timed out')) {
        setError(
          'Firestore Database "(default)" has not been created yet in your Firebase project. Please enable Firestore Database in the Firebase Console (Build > Firestore Database > Create database).'
        );
      } else {
        setError('Could not send message. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
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
              🎉 Thank you for reaching out! Your message has been safely received in Firebase. Roche will get back to you shortly.
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '0.85rem 1.25rem',
                marginBottom: '1.25rem',
                backgroundColor: 'rgba(255, 75, 75, 0.12)',
                border: '1px solid rgba(255, 75, 75, 0.5)',
                borderRadius: '8px',
                color: '#ff6b6b',
                fontSize: '0.95rem',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="your.email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows={5}
              placeholder="Write something nice..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              <span>{loading ? 'Sending message...' : 'Send Message'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18"
                viewBox="0 0 24 24"
                width="18"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
