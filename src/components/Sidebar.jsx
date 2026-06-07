import React, { useState } from 'react';
import { Icon } from './Icon';

const NAV_GROUPS = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
      { id: 'analytics', icon: 'analytics', label: 'Analytics' },
    ]
  },
  {
    label: 'LEARN',
    items: [
      { id: 'explorer', icon: 'explorer', label: 'Study Explorer' },
      { id: 'flashcards', icon: 'flashcard', label: 'Flashcards' },
      { id: 'tutorials', icon: 'book', label: 'Tutorials Hub' },
    ]
  },
  {
    label: 'PRACTICE',
    items: [
      { id: 'quiz', icon: 'quiz', label: 'Exam Center' },
      { id: 'interview', icon: 'mic', label: 'Mock Interview' },
      { id: 'sandbox', icon: 'terminal', label: 'Coding Sandbox' },
      { id: 'sqllab', icon: 'sql', label: 'SQL Practice Lab' },
    ]
  },
  {
    label: 'CAREER',
    items: [
      { id: 'roadmap', icon: 'roadmap', label: 'Career Roadmap' },
      { id: 'resources', icon: 'resources', label: 'Resource Library' },
      { id: 'architecture', icon: 'architecture', label: 'System Diagrams' },
    ]
  }
];

export const Sidebar = ({ activeTab, setActiveTab, handleResetAllProgress }) => {
  const [collapsed, setCollapsed] = useState({});

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
        {NAV_GROUPS.map(group => (
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

            {!collapsed[group.label] && group.items.map(item => (
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
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 0 0.5rem 0' }}>
        <div className="system-status">
          <span className="status-dot"></span>
          <span>SYS.ONLINE: 2026</span>
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
    reset: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
      </svg>
    )
  };
  return icons[name] || <span>•</span>;
};
