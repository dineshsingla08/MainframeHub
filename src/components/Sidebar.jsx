import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

const NAV_GROUPS = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', icon: 'dashboard', label: 'Overview' },
      { id: 'analytics', icon: 'analytics', label: 'Analytics' },
      { id: 'leaderboard', icon: 'trophy', label: 'Leaderboard' },
      { id: 'feedback', icon: 'feedback', label: 'User Feedback' },
      { id: 'about', icon: 'info', label: 'About Us' },
    ]
  },
  {
    label: 'LEARN',
    items: [
      { id: 'explorer', icon: 'explorer', label: 'Study Explorer' },
      { id: 'flashcards', icon: 'flashcard', label: 'Flashcards' },
      { id: 'tutorials', icon: 'book', label: 'Tutorials Hub' },
      { id: 'blogs', icon: 'blog', label: 'Blogs' },
      { id: 'abendsolver', icon: 'shield', label: 'Abend Solver' },
    ]
  },
  {
    label: 'PRACTICE',
    items: [
      { id: 'quiz', icon: 'quiz', label: 'Exam Center' },
      { id: 'interview', icon: 'mic', label: 'Mock Interview' },
      { id: 'sandbox', icon: 'terminal', label: 'Coding Sandbox' },
      { id: 'sqllab', icon: 'sql', label: 'SQL Practice Lab' },
      { id: 'scenarios', icon: 'scenarios', label: 'Incident Scenarios' },
    ]
  },
  {
    label: 'CAREER',
    items: [
      { id: 'roadmap', icon: 'roadmap', label: 'Career Roadmap' },
      { id: 'resources', icon: 'resources', label: 'Resource Library' },
      { id: 'careers', icon: 'business', label: 'Mainframe Careers' },
      { id: 'architecture', icon: 'architecture', label: 'System Diagrams' },
      { id: 'forum', icon: 'chat', label: 'Community Forum' },
    ]
  }
];

export const Sidebar = ({ activeTab, setActiveTab, handleResetAllProgress, user }) => {
  const [collapsed, setCollapsed] = useState({});
  const [systemOnline, setSystemOnline] = useState(true);

  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        if (res.ok) {
          const data = await res.json();
          setSystemOnline(data.status === 'HEALTHY');
        } else {
          setSystemOnline(false);
        }
      } catch (err) {
        setSystemOnline(false);
      }
    };

    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleGroup = (label) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="sidebar">
      <div className="logo-section">
        <h1 className="logo-title">
          <span className="pulse-glow">◈</span> MainframeHub
        </h1>
        <div className="logo-subtitle">THE PROFESSIONAL'S HUB</div>
      </div>

      <div className="nav-menu">
        {NAV_GROUPS.map(group => {
          let itemsToRender = [...group.items];
          if (group.label === 'OVERVIEW' && user && (user.username === 'Dineshsingla08' || user.email === 'dineshsingla08@gmail.com')) {
            itemsToRender.push({ id: 'admin', icon: 'architecture', label: 'Admin Console' });
          }

          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  letterSpacing: '2px',
                  padding: '0.6rem 1rem 0.3rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.3rem'
                }}
              >
                <span>{group.label}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{collapsed[group.label] ? '▶' : '▼'}</span>
              </button>

              {!collapsed[group.label] && itemsToRender.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 0 0.5rem 0' }}>
        <div className="system-status">
          <span className="status-dot" style={{ background: systemOnline ? 'var(--accent-color)' : '#ff4444', animation: systemOnline ? 'pulse 2s infinite ease-in-out' : 'none' }}></span>
          <span>{systemOnline ? 'SYS.ONLINE: OPERATIONAL' : 'SYS.OFFLINE: DISCONNECTED'}</span>
        </div>
        <button className="action-btn" onClick={handleResetAllProgress} style={{ justifyContent: 'center', width: '100%' }}>
          <Icon name="reset" /> Reset Statistics
        </button>
      </div>
    </div>
  );
};

// Extended icon component for nav items
const NavIcon = ({ name }) => {
  const icons = {
    dashboard: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
        <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
      </svg>
    ),
    analytics: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18l4-4 4 2 4-6 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <line x1="3" y1="21" x2="21" y2="21" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    explorer: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    flashcard: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <line x1="12" y1="4" x2="12" y2="18" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    shield: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    book: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    quiz: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M8 10l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="8" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    mic: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M5 10a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" fill="none"/>
        <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/>
        <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    terminal: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polyline points="8,9 12,13 8,17" stroke="currentColor" strokeWidth="2" fill="none"/>
        <line x1="12" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    sql: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="12" cy="6" rx="9" ry="3" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M3 6v6c0 1.657 4.03 3 9 3s9-1.343 9-3V6" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M3 12v6c0 1.657 4.03 3 9 3s9-1.343 9-3v-6" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    roadmap: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17l6-12 6 12 6-12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    resources: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    architecture: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="16" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="9" y="16" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
        <line x1="8" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="2"/>
        <line x1="12" y1="5" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    scenarios: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    chat: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
    reset: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
      </svg>
    ),
    trophy: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
        <path d="M12 2a6 6 0 0 1 6 6v3.5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    business: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    feedback: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    blog: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  };
  return icons[name] || <span>•</span>;
};
