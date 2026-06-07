import React from 'react';
import { Icon } from './Icon';

const QUICK_ACTIONS = [
  { tab: 'explorer', label: 'Study Questions', icon: '🔍', color: '#00aaff', desc: 'Browse all Q&A by topic' },
  { tab: 'quiz', label: 'Take Exam', icon: '📝', color: '#00ff41', desc: 'Test yourself under time pressure' },
  { tab: 'interview', label: 'Mock Interview', icon: '🎙️', color: '#ff6b35', desc: 'Simulate a real technical round' },
  { tab: 'tutorials', label: 'Read Tutorials', icon: '📚', color: '#9b59b6', desc: 'Structured learning content' },
  { tab: 'sqllab', label: 'SQL Practice', icon: '🗄️', color: '#ffaa00', desc: 'Run DB2 SQL queries hands-on' },
  { tab: 'roadmap', label: 'Career Map', icon: '🗺️', color: '#e74c3c', desc: 'Plan your mainframe career path' },
  { tab: 'flashcards', label: 'Flashcards', icon: '🎴', color: '#00ccaa', desc: 'Quick-fire knowledge review' },
  { tab: 'resources', label: 'Resources', icon: '📖', color: '#aaaaff', desc: 'IBM Redbooks & reference cards' },
];

export const Dashboard = ({
    questionsData,
    mastered,
    needsReview,
    totalQuestions,
    masteredPercentage,
    reviewPercentage,
    getCategoryProgress,
    setActiveTab
}) => {
    const readinessColor = masteredPercentage >= 70 ? '#00ff41' : masteredPercentage >= 40 ? '#ffaa00' : '#ff4444';
    const readinessLabel = masteredPercentage >= 80 ? 'INTERVIEW READY ✓' : masteredPercentage >= 60 ? 'ALMOST THERE' : masteredPercentage >= 30 ? 'IN PROGRESS' : 'JUST STARTED';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Hero Welcome Banner */}
            <div className="metric-card" style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(0,255,65,0.06) 0%, rgba(0,0,0,0.2) 100%)',
                borderTop: `3px solid var(--accent-color)`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', background: 'radial-gradient(ellipse at right, rgba(var(--accent-rgb),0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '3px', marginBottom: '0.4rem' }}>
                            MAINFRAMEOS — INTERVIEW SUITE v2.0
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>
                            Welcome to Your<br/><span style={{ color: 'var(--accent-color)' }}>Mainframe Learning Hub</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', maxWidth: '500px' }}>
                            The #1 platform for COBOL, JCL, DB2, CICS, VSAM & z/OS interview preparation. 
                            {totalQuestions}+ curated questions, tutorials, mock interviews, and SQL practice.
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1.2rem 2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: `1px solid ${readinessColor}44` }}>
                        <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '0.2rem' }}>READINESS</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: readinessColor, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{masteredPercentage}%</div>
                        <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: readinessColor, fontWeight: '700', marginTop: '0.3rem' }}>{readinessLabel}</div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid">
                <div className="metric-card">
                    <div className="metric-header">
                        <span>QUESTION BANK</span>
                        <Icon name="explorer" />
                    </div>
                    <div className="metric-val">{totalQuestions.toLocaleString()} Qs</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>COBOL, JCL, VSAM, DB2, CICS, SQL</div>
                </div>
                <div className="metric-card">
                    <div className="metric-header">
                        <span>MASTERED</span>
                        <Icon name="check" />
                    </div>
                    <div className="metric-val">{mastered.length} / {totalQuestions}</div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${masteredPercentage}%` }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>Progress</span>
                        <span>{masteredPercentage}% Complete</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-header">
                        <span>NEEDS REVIEW</span>
                        <Icon name="star" />
                    </div>
                    <div className="metric-val">{needsReview.length} Qs</div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${reviewPercentage}%`, backgroundColor: '#ffaa00' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>Flagged items</span>
                        <span>{reviewPercentage}% Flagged</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '0.8rem' }}>
                    QUICK ACTIONS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.8rem' }}>
                    {QUICK_ACTIONS.map(action => (
                        <button
                            key={action.tab}
                            onClick={() => setActiveTab(action.tab)}
                            style={{
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.25)',
                                border: `1px solid ${action.color}33`,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                borderTop: `3px solid ${action.color}`
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 20px ${action.color}22`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{action.icon}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{action.label}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{action.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Progress */}
            <div className="metric-card" style={{ gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.5rem', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
                    TOPIC-WISE PREPAREDNESS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {['COBOL', 'JCL', 'VSAM', 'DB2', 'CICS', 'SQL'].map(cat => {
                        const progress = getCategoryProgress(cat);
                        const categoryQs = questionsData.filter(q => q.category === cat);
                        const catMastered = categoryQs.filter(q => mastered.includes(q.id)).length;
                        const barColor = progress >= 70 ? '#00ff41' : progress >= 40 ? '#ffaa00' : '#ff6644';
                        return (
                            <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.95rem' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)' }}>{cat}</span>
                                    <span style={{ color: barColor }}>{progress}%</span>
                                </div>
                                <div className="progress-bar-container" style={{ height: '8px' }}>
                                    <div className="progress-bar-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}88)` }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <span>Mastered: {catMastered} / {categoryQs.length}</span>
                                    <span>{categoryQs.length - catMastered} remaining</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="tip-box">
                <Icon name="info" className="tip-box-icon" />
                <div className="tip-text">
                    <strong>Pro Tip:</strong> IBM Z's COBOL processes over <strong>$3 trillion</strong> in daily transactions worldwide. Mainframe skills are in <strong>critical shortage</strong> — companies are paying premium salaries for experienced z/OS professionals. Start with Study Explorer, take a Quiz, then simulate a Mock Interview!
                </div>
            </div>
        </div>
    );
};
