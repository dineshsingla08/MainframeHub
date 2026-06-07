import React, { useMemo } from 'react';

const STUDY_TIPS = [
  'Review your weakest categories first each session',
  'Spend at least 20 minutes daily to build momentum',
  'Mark questions as "Starred" to revisit before interviews',
  'Use flashcards for quick recall practice on the go',
  'Take a timed mock exam weekly to simulate real conditions',
  'After finishing a category, restart with Intermediate questions',
];

export const ProgressAnalytics = ({
  questionsData,
  mastered,
  needsReview,
  starred,
  totalQuestions,
  masteredPercentage,
  reviewPercentage,
}) => {
  const categories = ['COBOL', 'JCL', 'VSAM', 'DB2', 'CICS', 'SQL'];

  const catStats = useMemo(() => {
    return categories.map(cat => {
      const total = questionsData.filter(q => q.category === cat).length;
      const masteredCount = questionsData.filter(q => q.category === cat && mastered.includes(q.id)).length;
      const reviewCount = questionsData.filter(q => q.category === cat && needsReview.includes(q.id)).length;
      const starredCount = questionsData.filter(q => q.category === cat && starred.includes(q.id)).length;
      const pct = total > 0 ? Math.round((masteredCount / total) * 100) : 0;
      return { cat, total, masteredCount, reviewCount, starredCount, pct };
    });
  }, [questionsData, mastered, needsReview, starred]);

  const levelStats = useMemo(() => {
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    return levels.map(level => {
      const total = questionsData.filter(q => q.level === level).length;
      const masteredCount = questionsData.filter(q => q.level === level && mastered.includes(q.id)).length;
      const pct = total > 0 ? Math.round((masteredCount / total) * 100) : 0;
      return { level, total, masteredCount, pct };
    });
  }, [questionsData, mastered]);

  const weakestCats = [...catStats].sort((a,b) => a.pct - b.pct).slice(0, 3);
  const strongestCats = [...catStats].sort((a,b) => b.pct - a.pct).slice(0, 3);

  const tip = STUDY_TIPS[new Date().getDay() % STUDY_TIPS.length];

  const overallScore = masteredPercentage;
  const readinessLabel =
    overallScore >= 80 ? { label: 'INTERVIEW READY', color: '#00ff41' } :
    overallScore >= 60 ? { label: 'ALMOST THERE', color: '#88cc00' } :
    overallScore >= 40 ? { label: 'PROGRESSING', color: '#ffaa00' } :
    overallScore >= 20 ? { label: 'EARLY STAGE', color: '#ff8800' } :
    { label: 'JUST STARTING', color: '#ff4444' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header Banner */}
      <div className="metric-card" style={{
        padding: '1.5rem 2rem',
        background: `linear-gradient(135deg, rgba(var(--accent-rgb),0.08), rgba(0,0,0,0.3))`,
        borderTop: `3px solid ${readinessLabel.color}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>INTERVIEW READINESS SCORE</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: '800', color: readinessLabel.color, lineHeight: 1 }}>
            {overallScore}%
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: readinessLabel.color, fontWeight: '700', marginTop: '0.3rem' }}>
            {readinessLabel.label}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'MASTERED', val: mastered.length, color: '#00ff41' },
            { label: 'NEEDS REVIEW', val: needsReview.length, color: '#ffaa00' },
            { label: 'STARRED', val: starred.length, color: '#ffd700' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0.7rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: `1px solid ${s.color}33` }}>
              <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color, fontFamily: 'var(--font-mono)' }}>{s.val}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>of {totalQuestions}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Mastery Bars */}
      <div className="metric-card">
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.5rem' }}>
          📊 CATEGORY-WISE MASTERY
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {catStats.map(s => {
            const barColor = s.pct >= 70 ? '#00ff41' : s.pct >= 40 ? '#ffaa00' : '#ff4444';
            return (
              <div key={s.cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', minWidth: '50px' }}>{s.cat}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {s.masteredCount}/{s.total} mastered · {s.reviewCount} review · ⭐{s.starredCount}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: barColor, fontSize: '0.9rem' }}>{s.pct}%</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${s.pct}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${barColor}, ${barColor}88)`,
                    borderRadius: '5px',
                    transition: 'width 0.6s ease',
                    boxShadow: `0 0 8px ${barColor}44`
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Progress */}
      <div className="metric-card">
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.5rem' }}>
          🎯 DIFFICULTY LEVEL PROGRESS
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {levelStats.map(l => {
            const colors = { Beginner: '#00ff41', Intermediate: '#ffaa00', Advanced: '#ff4444' };
            const c = colors[l.level];
            return (
              <div key={l.level} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: `1px solid ${c}33` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: c, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{l.level}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>{l.pct}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                  {l.masteredCount} / {l.total} questions
                </div>
                <div style={{ height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px' }}>
                  <div style={{ width: `${l.pct}%`, height: '100%', background: c, borderRadius: '3px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="metric-card" style={{ borderTop: '3px solid #00ff41' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#00ff41', marginBottom: '1rem' }}>💪 STRONGEST AREAS</h3>
          {strongestCats.map((s, i) => (
            <div key={s.cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                #{i+1} {s.cat}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#00ff41', fontWeight: '700', fontSize: '0.9rem' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
        <div className="metric-card" style={{ borderTop: '3px solid #ff4444' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#ff4444', marginBottom: '1rem' }}>⚠️ FOCUS AREAS</h3>
          {weakestCats.map((s, i) => (
            <div key={s.cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                {s.cat}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#ff4444', fontWeight: '700', fontSize: '0.9rem' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily tip */}
      <div className="tip-box">
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <div className="tip-text">
          <strong>Today's Study Tip:</strong> {tip}
        </div>
      </div>

      {/* Question bank breakdown */}
      <div className="metric-card">
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.5rem' }}>
          📚 QUESTION BANK BREAKDOWN
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.8rem' }}>
          {catStats.map(s => (
            <div key={s.cat} style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{s.cat}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)', margin: '0.3rem 0' }}>{s.total}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>questions available</div>
            </div>
          ))}
          <div style={{ padding: '0.8rem', background: 'rgba(var(--accent-rgb),0.05)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(var(--accent-rgb),0.2)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-color)', fontSize: '0.9rem' }}>TOTAL</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)', margin: '0.3rem 0' }}>{totalQuestions}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>across all topics</div>
          </div>
        </div>
      </div>
    </div>
  );
};
