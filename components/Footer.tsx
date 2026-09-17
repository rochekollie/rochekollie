import React from 'react';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="section-container footer-content">
        <div className="footer-info">
          <p>&copy; {new Date().getFullYear()} Roche Kollie. All rights reserved.</p>
        </div>
        <div className="footer-social">
          <a href="https://x.com/rochekollie" target="_blank" rel="noopener noreferrer">
            Twitter / X
          </a>
          <a href="https://linkedin.com/in/rochekollie" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://discord.com/rochekollie" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
          <a href="https://github.com/rochekollie" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
