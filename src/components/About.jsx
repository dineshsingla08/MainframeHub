import React, { useState } from 'react';

const STATS = [
  { value: '15', label: 'Tutorial Topics', icon: '📚' },
  { value: '1500+', label: 'Interview Questions', icon: '❓' },
  { value: '200+', label: 'Quiz Questions', icon: '🧠' },
  { value: '87', label: 'Abend Codes', icon: '⚠️' },
  { value: '52', label: 'Real-World Scenarios', icon: '🏭' },
  { value: '6', label: 'Career Levels', icon: '🎯' },
];

const TOPICS = [
  { name: 'COBOL', icon: '📦', desc: 'Structured programming language' },
  { name: 'JCL', icon: '📜', desc: 'Job Control Language for batch' },
  { name: 'DB2', icon: '🗄️', desc: 'Relational database on z/OS' },
  { name: 'CICS', icon: '⚡', desc: 'Transaction processing engine' },
  { name: 'VSAM', icon: '💾', desc: 'Virtual Storage Access Method' },
  { name: 'REXX', icon: '🔧', desc: 'Scripting & automation language' },
  { name: 'z/OS', icon: '🖥️', desc: 'IBM mainframe operating system' },
  { name: 'RACF', icon: '🔐', desc: 'Security access control' },
  { name: 'TSO/ISPF', icon: '🖱️', desc: 'Interactive system productivity' },
  { name: 'IMS', icon: '🌲', desc: 'Hierarchical database & DC' },
  { name: 'CA-7', icon: '📅', desc: 'Workload automation scheduling' },
  { name: 'DFSORT', icon: '⚙️', desc: 'Sort, merge & utilities' },
  { name: 'SMF', icon: '📊', desc: 'Performance & measurement' },
  { name: 'Linux on Z', icon: '🐧', desc: 'Linux on IBM Z hardware' },
  { name: 'Modernization', icon: '🚀', desc: 'Zowe, APIs & DevOps' },
];

const ROADMAP_LEVELS = [
  { level: 1, title: 'Trainee', skills: ['z/OS basics', 'TSO/ISPF navigation', 'JCL fundamentals'], color: '#00ff41' },
  { level: 2, title: 'Junior Developer', skills: ['COBOL basics', 'VSAM file handling', 'JCL advanced', 'Basic DB2'], color: '#00cc33' },
  { level: 3, title: 'Developer', skills: ['COBOL advanced', 'CICS programming', 'DB2 SQL & cursors', 'REXX scripting'], color: '#ffaa00' },
  { level: 4, title: 'Senior Developer', skills: ['IMS DB/DC', 'RACF security', 'Performance tuning', 'CA-7 scheduling'], color: '#ff8800' },
  { level: 5, title: 'Lead / Specialist', skills: ['SMF analysis', 'DFSORT advanced', 'WLM tuning', 'Incident management'], color: '#ff4444' },
  { level: 6, title: 'Architect', skills: ['Linux on Z', 'Modernization', 'Hybrid cloud', 'z/OS Connect APIs'], color: '#e74c3c' },
];

const FEATURES = [
  { icon: '🎯', title: 'Interview-Focused Content', desc: 'Every topic includes 50–100+ interview Q&A organized by difficulty — Beginner, Intermediate, and Advanced — curated from real interview experiences.' },
  { icon: '🧪', title: 'Hands-On Practice', desc: 'SQL Practice Lab, JCL/COBOL Coding Sandbox, Flashcards, and Mock Interview simulator give you experience beyond just reading theory.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Your learning journey is tracked across sessions. Mark questions as Mastered, Needs Review, or Starred for personalized revision.' },
  { icon: '🤝', title: 'Community Forum', desc: 'Post questions, share knowledge, and learn from fellow mainframe professionals in our integrated community forum.' },
  { icon: '🗺️', title: 'Structured Roadmap', desc: 'A 6-level career path from Trainee to Architect tells you exactly what to learn at each stage of your mainframe career.' },
  { icon: '⚡', title: 'Abend Code Solver', desc: '87 mainframe abend codes with root causes, fix instructions, and pro tips for debugging production issues fast.' },
];

const FAQS = [
  { q: 'Is MainframeHub free to use?', a: 'Yes — all tutorials, quizzes, mock interviews, and the Coding Sandbox are 100% free. No credit card or subscription required.' },
  { q: 'Do I need an account to use the platform?', a: 'No! You can access all content without logging in. Creating an account allows you to save your progress, star questions, and participate in the community forum.' },
  { q: 'Who is MainframeHub built for?', a: 'MainframeHub serves everyone from fresh trainees just starting mainframe careers to senior developers and architects preparing for interviews or upskilling.' },
  { q: 'How is MainframeHub different from TutorialsPoint or other sites?', a: 'MainframeHub is 100% dedicated to IBM Z mainframe. We offer interview Q&A, mock interviews, a coding sandbox, progress tracking, and career roadmaps — not just static tutorials.' },
  { q: 'What topics does MainframeHub cover?', a: 'All 15 core mainframe topics: COBOL, JCL, DB2, CICS, VSAM, REXX, z/OS, RACF, TSO/ISPF, IMS, CA-7, DFSORT, SMF, Linux on Z, and Mainframe Modernization.' },
  { q: 'How can I contribute or suggest new content?', a: 'Use the Community Forum to suggest topics, report issues, or share tips. Feedback from mainframe professionals is how we improve the platform.' },
];

export const About = ({ setActiveTab }) => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ padding: '0', maxWidth: '100%', overflowX: 'hidden' }}>

      {/* ── HERO SECTION ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,255,65,0.04) 0%, rgba(0,0,0,0) 60%)',
        border: '1px solid rgba(0,255,65,0.1)',
        borderRadius: '12px',
        padding: '3rem 2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-30%', right: '-10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}>◈</div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', fontSize: '1.8rem', color: 'var(--text-primary)', letterSpacing: '2px', margin: 0 }}>
              MAINFRAMEHUB
            </h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-color)', letterSpacing: '4px', marginTop: '0.2rem' }}>
              THE PROFESSIONAL'S HUB
            </div>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.8, maxWidth: '700px', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
          MainframeHub is a <strong style={{ color: 'var(--accent-color)' }}>free, comprehensive learning platform</strong> for IBM Z mainframe professionals.
          From fresh trainees to seasoned architects — our platform offers structured tutorials, 1500+ interview questions,
          hands-on practice tools, and a career roadmap covering all 15 core mainframe technologies.
        </p>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button className="action-btn" onClick={() => setActiveTab && setActiveTab('tutorials')}
            style={{ fontWeight: '800' }}>
            📚 Start Learning
          </button>
          <button className="action-btn" onClick={() => setActiveTab && setActiveTab('quiz')}
            style={{ background: 'rgba(0,255,65,0.05)', fontWeight: '700' }}>
            🧠 Take a Quiz
          </button>
          <button className="action-btn" onClick={() => setActiveTab && setActiveTab('roadmap')}
            style={{ background: 'rgba(0,255,65,0.05)', fontWeight: '700' }}>
            🗺️ View Roadmap
          </button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          ── PLATFORM STATS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {STATS.map(s => (
            <div key={s.label} className="card-panel" style={{
              padding: '1.2rem',
              textAlign: 'center',
              background: 'rgba(0,255,65,0.03)',
              border: '1px solid rgba(0,255,65,0.12)',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,65,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,255,65,0.12)'}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          ── WHY MAINFRAMEHUB
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card-panel" style={{
              padding: '1.3rem',
              border: '1px solid rgba(0,255,65,0.1)',
              borderRadius: '8px',
              transition: 'all 0.2s',
              cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,65,0.3)'; e.currentTarget.style.background = 'rgba(0,255,65,0.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,65,0.1)'; e.currentTarget.style.background = ''; }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-color)', marginBottom: '0.4rem', fontWeight: '700' }}>{f.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOPICS COVERED ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          ── 15 TOPICS COVERED
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.7rem' }}>
          {TOPICS.map(t => (
            <div key={t.name} className="card-panel" style={{
              padding: '0.9rem 1rem',
              border: '1px solid rgba(0,255,65,0.1)',
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', gap: '0.7rem',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
              onClick={() => setActiveTab && setActiveTab('tutorials')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.background = 'rgba(0,255,65,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,65,0.1)'; e.currentTarget.style.background = ''; }}
            >
              <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: '700' }}>{t.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CAREER ROADMAP ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          ── CAREER ROADMAP — 6 LEVELS
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {ROADMAP_LEVELS.map(l => (
            <div key={l.level} className="card-panel" style={{
              padding: '1rem 1.3rem',
              border: `1px solid ${l.color}22`,
              borderLeft: `3px solid ${l.color}`,
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', gap: '1.2rem',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = `${l.color}08`}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: `${l.color}22`, border: `2px solid ${l.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontWeight: '900', fontSize: '0.85rem',
                color: l.color, flexShrink: 0
              }}>{l.level}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '0.85rem', color: l.color, marginBottom: '0.2rem' }}>
                  Level {l.level} — {l.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {l.skills.map(s => (
                    <span key={s} style={{
                      background: `${l.color}12`, border: `1px solid ${l.color}33`,
                      padding: '0.1rem 0.4rem', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem'
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT THE CREATOR / ADMIN ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          ── ABOUT THE CREATOR
        </h2>
        <div className="card-panel" style={{
          padding: '1.8rem',
          border: '1px solid rgba(0,255,65,0.15)',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(0,255,65,0.03) 0%, transparent 100%)',
          display: 'flex', gap: '1.8rem', alignItems: 'flex-start', flexWrap: 'wrap'
        }}>
          <img 
            src="https://media.licdn.com/dms/image/v2/D5603AQEoHCFfsDAQ7A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1714478853125?e=2147483647&v=beta&t=GYei1Fe3YXzAmwdLF9UWHo2Yj6nTDT_VL1xtqSrCOCo"
            alt="Dinesh Singla Profile"
            style={{
              width: '82px', height: '82px', borderRadius: '50%',
              border: '2px solid var(--accent-color)',
              objectFit: 'cover', flexShrink: 0,
              boxShadow: '0 0 20px rgba(0,255,65,0.3)'
            }}
          />
          <div style={{ flex: 1, minWidth: '220px' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', fontSize: '1rem', color: 'var(--accent-color)', margin: '0 0 0.3rem' }}>
              Dinesh Singla
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.8rem', letterSpacing: '1px' }}>
              Software Engineer at NatWest Group | Senior Mainframe Developer
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Dinesh Singla is a Senior Mainframe Developer and Software Engineer at NatWest Group, with over 7 years of deep experience building and maintaining enterprise core systems across Wipro and Cognizant. Specializing in COBOL, JCL, DB2, CICS, and IMS, he built MainframeHub to compile real interview experiences and provide a structured learning path for developers at all stages of their careers.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a href="mailto:dineshsingla08@gmail.com" style={{
                padding: '0.3rem 0.8rem', background: 'rgba(0,255,65,0.08)',
                border: '1px solid rgba(0,255,65,0.25)', borderRadius: '4px',
                color: 'var(--accent-color)', textDecoration: 'none',
                fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: '700'
              }}>
                ✉ dineshsingla08@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/dineshsingla-mainframe/" target="_blank" rel="noopener noreferrer" style={{
                padding: '0.3rem 0.8rem', background: 'rgba(0,119,181,0.08)',
                border: '1px solid rgba(0,119,181,0.25)', borderRadius: '4px',
                color: '#0077b5', textDecoration: 'none',
                fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: '700'
              }}>
                🔗 LinkedIn Profile
              </a>
              <span style={{
                padding: '0.3rem 0.8rem', background: 'rgba(0,255,65,0.05)',
                border: '1px solid rgba(0,255,65,0.15)', borderRadius: '4px',
                color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)'
              }}>
                🛡 Platform Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          ── FREQUENTLY ASKED QUESTIONS
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="card-panel" style={{
              border: '1px solid rgba(0,255,65,0.1)',
              borderRadius: '6px', overflow: 'hidden',
              transition: 'border-color 0.2s'
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  padding: '1rem 1.2rem', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '700' }}>
                  {faq.q}
                </span>
                <span style={{
                  color: 'var(--accent-color)', fontSize: '0.9rem',
                  transform: openFaq === i ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s', flexShrink: 0
                }}>▼</span>
              </button>
              {openFaq === i && (
                <div style={{
                  padding: '0 1.2rem 1rem',
                  fontSize: '0.81rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                  borderTop: '1px solid rgba(0,255,65,0.08)'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER CTA ── */}
      <div style={{
        textAlign: 'center', padding: '2.5rem 1.5rem',
        border: '1px solid rgba(0,255,65,0.12)',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, rgba(0,255,65,0.03) 0%, transparent 100%)'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>◈</div>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '0.5rem', letterSpacing: '2px' }}>
          READY TO MASTER THE MAINFRAME?
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Free forever. No subscription. No credit card. Start learning today.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="action-btn" onClick={() => setActiveTab && setActiveTab('tutorials')}
            style={{ fontWeight: '800', padding: '0.7rem 1.5rem' }}>
            🚀 Start Tutorials
          </button>
          <button className="action-btn" onClick={() => setActiveTab && setActiveTab('explorer')}
            style={{ background: 'rgba(0,255,65,0.05)', fontWeight: '700', padding: '0.7rem 1.5rem' }}>
            🔍 Study Explorer
          </button>
          <button className="action-btn" onClick={() => setActiveTab && setActiveTab('forum')}
            style={{ background: 'rgba(0,255,65,0.05)', fontWeight: '700', padding: '0.7rem 1.5rem' }}>
            💬 Join Community
          </button>
        </div>
      </div>
    </div>
  );
};
