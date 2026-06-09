import React, { useState, useEffect, useRef } from 'react';
import { allQuestions } from '../data/questions';

const INTERVIEW_DOMAINS = [
  { id: 'COBOL', label: 'COBOL Interview', icon: '📦', color: '#00ff41', description: 'Senior COBOL developer position at a bank' },
  { id: 'JCL', label: 'JCL/Batch Interview', icon: '⚙️', color: '#ffaa00', description: 'Batch operations & JCL specialist role' },
  { id: 'DB2', label: 'DB2/SQL Interview', icon: '🗄️', color: '#00aaff', description: 'DB2 DBA or SQL developer position' },
  { id: 'CICS', label: 'CICS Interview', icon: '🖥️', color: '#ff6b35', description: 'CICS transaction developer role' },
  { id: 'VSAM', label: 'VSAM/Storage Interview', icon: '💾', color: '#9b59b6', description: 'Storage management specialist' },
  { id: 'ALL', label: 'Mixed Panel Interview', icon: '🎯', color: '#e74c3c', description: 'Full-stack mainframe technical round' },
];

const INTERVIEWER_PERSONAS = [
  { name: 'Sarah Chen', role: 'Senior Technical Lead', avatar: '👩‍💼' },
  { name: 'Raj Patel', role: 'Principal Architect', avatar: '👨‍💻' },
  { name: 'Mike Johnson', role: 'Technical Manager', avatar: '👔' },
];

const FOLLOW_UP_QUESTIONS = {
  COBOL: [
    'Can you explain that with a practical example from your experience?',
    'How would that differ in a real production scenario?',
    'What would happen if there was a FILE STATUS error there?',
    'How would you optimize that for performance?',
  ],
  DB2: [
    'What would the EXPLAIN output look like for that query?',
    'How would you handle a lock timeout in that scenario?',
    'What index would you create to optimize that?',
    'How does that change with partitioned tables?',
  ],
  JCL: [
    'What ABEND code would you see if that step failed?',
    'How would you pass data between those two steps?',
    'What if that dataset was GDG instead of sequential?',
    'How would you test that in a development environment?',
  ],
  CICS: [
    'How does pseudo-conversational mode affect that?',
    'What happens if the task times out?',
    'How would you handle CICS recovery there?',
    'What BMS definition would you need for that?',
  ],
  DEFAULT: [
    'Can you elaborate on that point?',
    'Interesting! How does that relate to performance?',
    'What are the trade-offs of that approach?',
    'Have you encountered that in a real project?',
  ]
};

const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

export const MockInterview = ({ user, onRequireAuth }) => {
  const [phase, setPhase] = useState('setup'); // setup | intro | interview | review
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [numQuestions, setNumQuestions] = useState(5);
  const [interviewer] = useState(INTERVIEWER_PERSONAS[Math.floor(Math.random() * INTERVIEWER_PERSONAS.length)]);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timer, setTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selfRatings, setSelfRatings] = useState([]);
  const [followUpShown, setFollowUpShown] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);

  const domain = INTERVIEW_DOMAINS.find(d => d.id === selectedDomain);

  const startInterview = () => {
    if (!user) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    let pool = allQuestions;
    if (selectedDomain !== 'ALL') pool = pool.filter(q => q.category === selectedDomain);
    
    // Ensure we only select questions that have a valid answer (not just multiple-choice options)
    pool = pool.filter(q => q.answer && q.answer.trim().length > 0);
    
    // If pool is empty, provide a fallback to prevent crashing
    if (pool.length === 0) {
        pool = allQuestions.filter(q => q.answer && q.answer.trim().length > 0);
    }
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, numQuestions);
    setQuestions(selected);
    setCurrentIdx(0);
    setAnswers([]);
    setSelfRatings([]);
    setCurrentAnswer('');
    setTimer(0);
    setTotalTimer(0);
    setShowAnswer(false);
    setFollowUpShown(false);
    setPhase('intro');

    setTimeout(() => {
      setPhase('interview');
      startTimer();
    }, 3000);
  };

  const startTimer = () => {
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    totalTimerRef.current = setInterval(() => setTotalTimer(t => t + 1), 1000);
  };

  const revealAnswer = () => {
    clearInterval(timerRef.current);
    setShowAnswer(true);
    // Show a follow-up after a moment
    const followUps = FOLLOW_UP_QUESTIONS[selectedDomain] || FOLLOW_UP_QUESTIONS.DEFAULT;
    setFollowUp(followUps[Math.floor(Math.random() * followUps.length)]);
    setTimeout(() => setFollowUpShown(true), 1500);
  };

  const rateAndNext = (rating) => {
    const newAnswers = [...answers, { question: questions[currentIdx], userAnswer: currentAnswer, rating, timeTaken: timer }];
    const newRatings = [...selfRatings, rating];
    setAnswers(newAnswers);
    setSelfRatings(newRatings);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setCurrentAnswer('');
      setShowAnswer(false);
      setFollowUpShown(false);
      setFollowUp('');
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      clearInterval(totalTimerRef.current);
      setPhase('review');
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(totalTimerRef.current);
    };
  }, []);

  const avgRating = selfRatings.length ? (selfRatings.reduce((a,b) => a+b, 0) / selfRatings.length).toFixed(1) : 0;
  const getPerformanceLabel = (avg) => {
    if (avg >= 4) return { label: 'EXCELLENT', color: '#00ff41' };
    if (avg >= 3) return { label: 'GOOD', color: '#66cc44' };
    if (avg >= 2) return { label: 'NEEDS WORK', color: '#ffaa00' };
    return { label: 'KEEP PRACTICING', color: '#ff4444' };
  };

  // SETUP PHASE
  if (phase === 'setup') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="metric-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎙️</div>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
          MOCK INTERVIEW SIMULATOR
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Simulate a real technical interview. Answer out loud or type your response, then reveal the model answer and self-assess.
        </p>
      </div>

      <div className="metric-card">
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>SELECT INTERVIEW TYPE</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
          {INTERVIEW_DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              style={{
                padding: '1rem',
                background: selectedDomain === d.id ? `${d.color}18` : 'rgba(0,0,0,0.2)',
                border: `2px solid ${selectedDomain === d.id ? d.color : 'var(--border-muted)'}`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: selectedDomain === d.id ? `0 0 12px ${d.color}44` : 'none'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{d.icon}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: selectedDomain === d.id ? d.color : 'var(--text-primary)', fontSize: '0.85rem' }}>{d.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{d.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="metric-card">
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>NUMBER OF QUESTIONS</h3>
        <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
          {[3, 5, 8, 10, 15].map(n => (
            <button
              key={n}
              onClick={() => setNumQuestions(n)}
              style={{
                padding: '0.6rem 1.2rem',
                background: numQuestions === n ? 'rgba(var(--accent-rgb),0.2)' : 'rgba(0,0,0,0.2)',
                border: `1px solid ${numQuestions === n ? 'var(--accent-color)' : 'var(--border-muted)'}`,
                borderRadius: '6px',
                color: numQuestions === n ? 'var(--accent-color)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontWeight: numQuestions === n ? '700' : '400',
                fontSize: '0.9rem'
              }}
            >
              {n} Qs
            </button>
          ))}
        </div>
        <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Estimated time: ~{numQuestions * 3}–{numQuestions * 5} minutes
        </div>
      </div>

      <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '2rem' }}>{interviewer.avatar}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-primary)' }}>{interviewer.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{interviewer.role} — your interviewer today</div>
        </div>
      </div>

      <button
        className="action-btn"
        onClick={startInterview}
        style={{ padding: '1rem 2rem', fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: '800', justifyContent: 'center', borderRadius: '10px' }}
      >
        🎙️ START MOCK INTERVIEW
      </button>
    </div>
  );

  // INTRO PHASE
  if (phase === 'intro') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', animation: 'pulse 1s infinite' }}>{interviewer.avatar}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
        "Hello! I'm {interviewer.name}, {interviewer.role}.<br/>
        We'll be doing a {domain?.label} today with {numQuestions} questions.<br/>
        Take your time and speak clearly."
      </div>
      <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
        Starting in a moment...
      </div>
    </div>
  );

  // INTERVIEW PHASE
  if (phase === 'interview' && questions.length > 0) {
    const q = questions[currentIdx];
    const progress = ((currentIdx) / questions.length) * 100;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span style={{ color: timer > 120 ? '#ff4444' : 'var(--accent-color)' }}>⏱ {formatTime(timer)}</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-color)', borderRadius: '2px', transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* Interviewer asks */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>{interviewer.avatar}</div>
          <div className="metric-card" style={{ flex: 1, borderLeft: '3px solid var(--accent-color)' }}>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {interviewer.name} asks:
            </div>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.6', fontWeight: '500' }}>
              {q.question}
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', padding: '0.2rem 0.5rem', background: 'rgba(var(--accent-rgb),0.1)', borderRadius: '4px', display: 'inline-block', color: 'var(--accent-color)' }}>
              {q.category} · {q.level}
            </div>
          </div>
        </div>

        {/* Follow-up question */}
        {followUpShown && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem', flexShrink: 0 }}>{interviewer.avatar}</div>
            <div className="metric-card" style={{ flex: 1, borderLeft: '3px solid #ffaa00', background: 'rgba(255,170,0,0.05)' }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#ffaa00', marginBottom: '0.5rem' }}>
                Follow-up question:
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', fontStyle: 'italic' }}>
                "{followUp}"
              </p>
            </div>
          </div>
        )}

        {/* Answer area */}
        {!showAnswer ? (
          <div className="metric-card">
            <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              YOUR ANSWER (type key points — or answer verbally and click Reveal):
            </label>
            <textarea
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here, or speak it aloud and click 'Reveal Model Answer'..."
              style={{
                width: '100%',
                minHeight: '120px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-muted)',
                borderRadius: '8px',
                padding: '0.8rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              className="action-btn"
              onClick={revealAnswer}
              style={{ marginTop: '0.8rem', padding: '0.7rem 1.5rem', fontFamily: 'var(--font-mono)', fontWeight: '700' }}
            >
              💡 REVEAL MODEL ANSWER
            </button>
          </div>
        ) : (
          <div>
            {/* Model answer */}
            <div className="metric-card" style={{ borderLeft: '3px solid #00ff41', background: 'rgba(0,255,65,0.03)' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#00ff41', marginBottom: '0.6rem' }}>
                ✓ MODEL ANSWER
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.7' }}>
                {q.answer}
              </p>
            </div>

            {/* Self rating */}
            <div className="metric-card" style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                HOW WELL DID YOU ANSWER? (Honest self-assessment)
              </div>
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                {[
                  { r: 1, label: '❌ Missed it', color: '#ff4444' },
                  { r: 2, label: '⚠️ Partial', color: '#ff8800' },
                  { r: 3, label: '✓ Decent', color: '#ffcc00' },
                  { r: 4, label: '✓✓ Good', color: '#88cc00' },
                  { r: 5, label: '★ Nailed it!', color: '#00ff41' },
                ].map(({ r, label, color }) => (
                  <button
                    key={r}
                    onClick={() => rateAndNext(r)}
                    style={{
                      padding: '0.6rem 1.1rem',
                      background: `${color}22`,
                      border: `2px solid ${color}`,
                      borderRadius: '8px',
                      color: color,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // REVIEW PHASE
  if (phase === 'review') {
    const perf = getPerformanceLabel(parseFloat(avgRating));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
        <div className="metric-card" style={{ textAlign: 'center', padding: '2rem', borderTop: `3px solid ${perf.color}` }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: perf.color, margin: '0 0 0.5rem 0' }}>
            INTERVIEW COMPLETE — {perf.label}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            "Thank you for your time. We'll be in touch!" — {interviewer.name}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'AVG SELF-RATING', val: `${avgRating}/5`, color: perf.color },
            { label: 'QUESTIONS', val: questions.length, color: 'var(--accent-color)' },
            { label: 'TOTAL TIME', val: formatTime(totalTimer), color: '#ffaa00' },
            { label: 'STRONG ANSWERS', val: selfRatings.filter(r => r >= 4).length, color: '#00ff41' },
            { label: 'NEEDS REVIEW', val: selfRatings.filter(r => r <= 2).length, color: '#ff4444' },
          ].map(stat => (
            <div key={stat.label} className="metric-card" style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{stat.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: stat.color, fontFamily: 'var(--font-mono)' }}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* Per-question breakdown */}
        <div className="metric-card">
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>QUESTION-BY-QUESTION BREAKDOWN</h3>
          {answers.map((a, idx) => {
            const ratingColors = ['', '#ff4444', '#ff8800', '#ffcc00', '#88cc00', '#00ff41'];
            return (
              <div key={idx} style={{ padding: '0.8rem', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', borderLeft: `3px solid ${ratingColors[a.rating]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', flex: 1 }}>
                    Q{idx + 1}: {a.question.question.substring(0, 120)}{a.question.question.length > 120 ? '...' : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <span style={{ color: '#888' }}>⏱ {formatTime(a.timeTaken)}</span>
                    <span style={{ color: ratingColors[a.rating], fontWeight: '700' }}>{a.rating}/5</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="action-btn"
          onClick={() => setPhase('setup')}
          style={{ padding: '0.8rem 1.5rem', fontFamily: 'var(--font-mono)', fontWeight: '700', justifyContent: 'center' }}
        >
          🔄 START ANOTHER INTERVIEW
        </button>
      </div>
    );
  }

  return null;
};
