import React, { useState } from 'react';

const CURRENT_YEAR = new Date().getFullYear();

const FOOTER_LINKS = [
  {
    group: 'Study',
    links: [
      { label: 'Study Explorer', tab: 'explorer' },
      { label: 'Flashcards', tab: 'flashcards' },
      { label: 'Tutorials Hub', tab: 'tutorials' },
    ]
  },
  {
    group: 'Practice',
    links: [
      { label: 'Exam Center', tab: 'quiz' },
      { label: 'Mock Interview', tab: 'interview' },
      { label: 'SQL Practice Lab', tab: 'sqllab' },
      { label: 'Coding Sandbox', tab: 'sandbox' },
    ]
  },
  {
    group: 'Career',
    links: [
      { label: 'Career Roadmap', tab: 'roadmap' },
      { label: 'Resource Library', tab: 'resources' },
      { label: 'System Diagrams', tab: 'architecture' },
      { label: 'Progress Analytics', tab: 'analytics' },
    ]
  },
  {
    group: 'Technologies',
    links: [
      { label: 'COBOL Interview Questions', tab: 'explorer' },
      { label: 'JCL & DFSORT', tab: 'explorer' },
      { label: 'DB2 for z/OS', tab: 'explorer' },
      { label: 'CICS Transactions', tab: 'explorer' },
      { label: 'VSAM & Storage', tab: 'explorer' },
    ]
  }
];

const STATS = [
  { label: 'Questions', value: '1,500+' },
  { label: 'Topics Covered', value: '8' },
  { label: 'SQL Challenges', value: '8' },
  { label: 'Career Roles', value: '6' },
];

export const Footer = ({ setActiveTab }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="app-footer">
      {/* Stats Banner */}
      <div className="footer-stats-bar">
        {STATS.map((s, i) => (
          <div key={i} className="footer-stat">
            <span className="footer-stat-val">{s.value}</span>
            <span className="footer-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main Footer Body */}
      <div className="footer-body">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="pulse-glow">◈</span> MainframeHub
          </div>
          <div className="footer-tagline">
            THE MAINFRAME PROFESSIONAL'S HUB
          </div>
          <p className="footer-desc">
            The #1 online platform for IBM Mainframe professionals preparing for technical interviews in COBOL, JCL, DB2, CICS, VSAM, IMS, REXX, and z/OS technologies.
          </p>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <div className="footer-newsletter-label">📧 GET WEEKLY MAINFRAME TIPS</div>
            {subscribed ? (
              <div className="footer-subscribed">
                ✓ Subscribed! Watch your inbox for weekly Mainframe tips.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="footer-email-input"
                  required
                />
                <button type="submit" className="footer-subscribe-btn">
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        {FOOTER_LINKS.map((group) => (
          <div key={group.group} className="footer-link-group">
            <div className="footer-group-title">{group.group.toUpperCase()}</div>
            <ul className="footer-link-list">
              {group.links.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => setActiveTab(link.tab)}
                    className="footer-link-btn"
                  >
                    <span className="footer-link-arrow">▸</span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <div className="footer-system-badge">
            <span className="status-dot" style={{ width: '6px', height: '6px' }}></span>
            <span>SYS.ONLINE — All systems operational</span>
          </div>
          <span className="footer-copy">
            © {CURRENT_YEAR} MainframeHub — The Mainframe Professional's Hub
          </span>
        </div>
        <div className="footer-bottom-right">
          <span className="footer-tech-badge">React</span>
          <span className="footer-tech-badge">Vite</span>
          <span className="footer-tech-badge">IBM Z</span>
          <span className="footer-tech-badge">1,500+ Questions</span>
        </div>
      </div>
    </footer>
  );
};
