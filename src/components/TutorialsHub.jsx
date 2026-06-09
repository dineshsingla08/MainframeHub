import React, { useState } from 'react';
import { TUTORIALS } from '../data/tutorialsData';

const CATEGORIES = Object.keys(TUTORIALS);

const LEVEL_COLORS = {
  'Beginner': '#00ff41',
  'Intermediate': '#ffaa00',
  'Advanced': '#ff4444'
};

export const TutorialsHub = ({ initialCategory, clearInitialCategory }) => {
  const [activeCat, setActiveCat] = useState(initialCategory || null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);

  React.useEffect(() => {
    if (initialCategory) {
      setActiveCat(initialCategory);
      setActiveChapter(0);
    }
  }, [initialCategory]);

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(idx);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('- ') || line.match(/^\d+\. /)) {
        return <li key={i} style={{ marginBottom: '0.3rem' }} dangerouslySetInnerHTML={{ __html: boldLine.replace(/^[-\d]+\. ?/, '') }} />;
      }
      if (line === '') return <div key={i} style={{ height: '0.5rem' }} />;
      return <p key={i} style={{ margin: '0.2rem 0' }} dangerouslySetInnerHTML={{ __html: boldLine }} />;
    });
  };

  // --- TOPICS GRID VIEW ---
  if (!activeCat) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Mainframe Topics
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Master the core technologies of the IBM Z ecosystem. Select a topic below to begin your journey.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {CATEGORIES.map(cat => {
              const tutorial = TUTORIALS[cat];
              return (
                <div
                  key={cat}
                  onClick={() => { setActiveCat(cat); setActiveChapter(0); }}
                  className="metric-card"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = tutorial.color;
                    e.currentTarget.style.boxShadow = `0 10px 20px ${tutorial.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-muted)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    top: '-20px', 
                    right: '-20px', 
                    fontSize: '8rem', 
                    opacity: 0.03, 
                    transform: 'rotate(15deg)',
                    pointerEvents: 'none'
                  }}>
                    {tutorial.icon}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      fontSize: '2rem',
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${tutorial.color}15`,
                      borderRadius: '12px',
                      color: tutorial.color
                    }}>
                      {tutorial.icon}
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', margin: 0, color: 'var(--text-primary)' }}>
                      {cat}
                    </h2>
                  </div>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', flex: 1, marginBottom: '1.5rem' }}>
                    {tutorial.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-muted)',
                    paddingTop: '1rem',
                    marginTop: 'auto'
                  }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontFamily: 'var(--font-mono)', 
                      color: tutorial.color,
                      background: `${tutorial.color}15`,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px'
                    }}>
                      {tutorial.chapters.length} CHAPTERS
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      START LEARNING →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- READING VIEW ---
  const tutorial = TUTORIALS[activeCat];
  const chapter = tutorial.chapters[activeChapter];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid var(--border-muted)',
        display: 'flex',
        padding: '0.8rem 1.5rem',
        alignItems: 'center',
        gap: '1.5rem',
        flexShrink: 0
      }}>
        <button
          onClick={() => {
            setActiveCat(null);
            if (clearInitialCategory) clearInitialCategory();
          }}
          className="action-btn"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-muted)',
            padding: '0.4rem 0.8rem'
          }}
        >
          ← BACK TO TOPICS
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{tutorial.icon}</span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {activeCat}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {tutorial.chapters.length} Chapters available
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Chapter List Sidebar */}
        <div style={{
          width: '280px',
          minWidth: '280px',
          background: 'rgba(0,0,0,0.2)',
          borderRight: '1px solid var(--border-muted)',
          overflowY: 'auto',
          padding: '1.5rem 0'
        }}>
          <div style={{ padding: '0 1.5rem', marginBottom: '0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>
            COURSE CONTENTS
          </div>
          {tutorial.chapters.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => setActiveChapter(idx)}
              style={{
                padding: '0.8rem 1.5rem',
                textAlign: 'left',
                background: activeChapter === idx ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                border: 'none',
                borderLeft: activeChapter === idx ? `3px solid ${tutorial.color}` : '3px solid transparent',
                color: activeChapter === idx ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s',
                fontSize: '0.85rem',
                lineHeight: '1.4'
              }}
              onMouseEnter={(e) => {
                if (activeChapter !== idx) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (activeChapter !== idx) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ fontWeight: activeChapter === idx ? '700' : '400' }}>
                {idx + 1}. {ch.title}
              </div>
              <div style={{
                fontSize: '0.7rem',
                marginTop: '0.3rem',
                color: LEVEL_COLORS[ch.level] || '#888',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: LEVEL_COLORS[ch.level] 
                }}></span>
                {ch.level}
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          <div style={{ maxWidth: '900px' }}>
            {/* Chapter Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', margin: 0 }}>
                  {chapter.title}
                </h2>
                <span style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  background: `${LEVEL_COLORS[chapter.level]}22`,
                  color: LEVEL_COLORS[chapter.level],
                  border: `1px solid ${LEVEL_COLORS[chapter.level]}44`
                }}>
                  {chapter.level}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {activeCat} › Chapter {activeChapter + 1}
              </div>
            </div>

            {/* Explanation */}
            <div className="metric-card" style={{ marginBottom: '2rem', lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-primary)', padding: '2rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {renderContent(chapter.content)}
              </ul>
            </div>

            {/* Code Example */}
            {chapter.code && (
              <div style={{ position: 'relative', marginBottom: '3rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px 8px 0 0',
                  borderTop: '1px solid var(--border-muted)',
                  borderLeft: '1px solid var(--border-muted)',
                  borderRight: '1px solid var(--border-muted)'
                }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: tutorial.color }}>
                    💻 {activeCat} SOURCE CODE
                  </span>
                  <button
                    onClick={() => copyCode(chapter.code, activeChapter)}
                    style={{
                      padding: '0.3rem 0.8rem',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      background: copiedCode === activeChapter ? 'rgba(0,255,65,0.2)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-muted)',
                      borderRadius: '4px',
                      color: copiedCode === activeChapter ? '#00ff41' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copiedCode === activeChapter ? '✓ COPIED' : '⎘ COPY CODE'}
                  </button>
                </div>
                <pre style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid var(--border-muted)',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  padding: '2rem',
                  margin: 0,
                  overflow: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: 'var(--accent-color)',
                  maxHeight: '500px'
                }}>
                  {chapter.code}
                </pre>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--border-muted)', marginBottom: '2rem' }}>
              <button
                onClick={() => setActiveChapter(prev => Math.max(0, prev - 1))}
                disabled={activeChapter === 0}
                className="action-btn"
                style={{ 
                  opacity: activeChapter === 0 ? 0.3 : 1,
                  padding: '0.8rem 1.5rem'
                }}
              >
                ← PREVIOUS CHAPTER
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>
                {activeChapter + 1} OF {tutorial.chapters.length}
              </span>
              <button
                onClick={() => setActiveChapter(prev => Math.min(tutorial.chapters.length - 1, prev + 1))}
                disabled={activeChapter === tutorial.chapters.length - 1}
                className="action-btn"
                style={{ 
                  opacity: activeChapter === tutorial.chapters.length - 1 ? 0.3 : 1,
                  padding: '0.8rem 1.5rem',
                  background: `rgba(${parseInt(tutorial.color.slice(1,3),16)},${parseInt(tutorial.color.slice(3,5),16)},${parseInt(tutorial.color.slice(5,7),16)}, 0.2)`,
                  borderColor: tutorial.color,
                  color: tutorial.color
                }}
              >
                NEXT CHAPTER →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
