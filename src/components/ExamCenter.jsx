import React from 'react';
import { Icon } from './Icon';

export const ExamCenter = ({
    quizActive,
    quizCategory,
    setQuizCategory,
    quizDifficulty,
    setQuizDifficulty,
    quizLength,
    setQuizLength,
    quizQuestions,
    quizIndex,
    quizSelectedOption,
    quizAnswered,
    quizScore,
    quizTimer,
    userName,
    setUserName,
    showCert,
    setShowCert,
    setQuizActive,
    handleStartQuiz,
    handleSelectQuizOption,
    handleNextQuizQuestion,
    user,
    onRequireAuth,
    quizHistory = [],
    flaggedQuestions = [],
    setFlaggedQuestions
}) => {
    const totalQuestionsCount = quizQuestions.length || 10;
    const passingScore = Math.ceil(totalQuestionsCount * 0.8);

    return (
        <div>
            {!quizActive && !showCert && (
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg-panel)', border: '1px solid var(--border-muted)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', boxShadow: 'var(--glow-primary)', backdropFilter: 'blur(16px)' }}>
                    <Icon name="award" style={{ width: '48px', height: '48px', color: 'var(--text-primary)', marginBottom: '1rem', filter: 'drop-shadow(var(--glow-primary))' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', textShadow: 'var(--glow-primary)', marginBottom: '1rem' }}>
                        MAINFRAME CERTIFICATION SIMULATOR
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Test your readiness with a mock examination of customizable questions. 
                        Score <strong>80% or higher</strong> to generate your custom <strong>System Operator Certificate</strong>!
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', marginBottom: '2rem' }}>
                        {/* Category Selector */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '380px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-light)', minWidth: '110px', textAlign: 'left' }}>Category:</span>
                            <select 
                                value={quizCategory} 
                                onChange={(e) => setQuizCategory(e.target.value)}
                                style={{ background: '#101726', border: '1px solid var(--border-muted)', color: 'var(--text-light)', padding: '0.5rem 1rem', borderRadius: '6px', flexGrow: 1, outline: 'none' }}
                            >
                                <option value="ALL">Mixed Mainframe Stack</option>
                                <option value="COBOL">COBOL Specialist</option>
                                <option value="JCL">JCL Specialist</option>
                                <option value="VSAM">VSAM Specialist</option>
                                <option value="DB2">DB2 Specialist</option>
                                <option value="CICS">CICS Specialist</option>
                                <option value="SQL">SQL Specialist</option>
                            </select>
                        </div>

                        {/* Difficulty Selector */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '380px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-light)', minWidth: '110px', textAlign: 'left' }}>Difficulty:</span>
                            <select 
                                value={quizDifficulty} 
                                onChange={(e) => setQuizDifficulty(e.target.value)}
                                style={{ background: '#101726', border: '1px solid var(--border-muted)', color: 'var(--text-light)', padding: '0.5rem 1rem', borderRadius: '6px', flexGrow: 1, outline: 'none' }}
                            >
                                <option value="ALL">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>

                        {/* Length Selector */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '380px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-light)', minWidth: '110px', textAlign: 'left' }}>Exam Length:</span>
                            <select 
                                value={quizLength} 
                                onChange={(e) => setQuizLength(parseInt(e.target.value, 10))}
                                style={{ background: '#101726', border: '1px solid var(--border-muted)', color: 'var(--text-light)', padding: '0.5rem 1rem', borderRadius: '6px', flexGrow: 1, outline: 'none' }}
                            >
                                <option value="25">25 Questions</option>
                                <option value="50">50 Questions</option>
                                <option value="75">75 Questions</option>
                                <option value="100">100 Questions</option>
                            </select>
                        </div>

                        {/* Name Input */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '380px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-light)', minWidth: '110px', textAlign: 'left' }}>Your Name:</span>
                            <input 
                                type="text" 
                                placeholder="Enter name for Certificate..."
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                style={{ background: '#101726', border: '1px solid var(--border-muted)', color: 'var(--text-light)', padding: '0.5rem 1rem', borderRadius: '6px', flexGrow: 1, outline: 'none' }}
                            />
                        </div>
                    </div>

                    <button 
                        className="action-btn" 
                        style={{ margin: '0 auto', padding: '0.85rem 2rem', fontSize: '1.05rem', backgroundColor: 'var(--badge-bg)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)', boxShadow: 'var(--glow-subtle)' }}
                        onClick={() => {
                            if (!user) {
                                if (onRequireAuth) onRequireAuth();
                                return;
                            }
                            handleStartQuiz(quizCategory, quizDifficulty, quizLength);
                        }}
                        type="button"
                    >
                        INITIATE ONLINE EXAMINATION
                    </button>
                </div>
            )}

            {quizActive && quizQuestions.length > 0 && (
                <div className="quiz-container">
                    <div className="quiz-header">
                        <div className="quiz-question-number">
                            QUESTION {quizIndex + 1} OF {quizQuestions.length} ({quizQuestions[quizIndex].category} - {quizQuestions[quizIndex].level})
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                onClick={() => {
                                    const qId = quizQuestions[quizIndex].id;
                                    setFlaggedQuestions(prev => 
                                        prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
                                    );
                                }}
                                style={{
                                    background: flaggedQuestions.includes(quizQuestions[quizIndex].id) ? '#ffaa0033' : 'transparent',
                                    border: `1px solid ${flaggedQuestions.includes(quizQuestions[quizIndex].id) ? '#ffaa00' : 'var(--text-secondary)'}`,
                                    color: flaggedQuestions.includes(quizQuestions[quizIndex].id) ? '#ffaa00' : 'var(--text-secondary)',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                }}
                            >
                                🚩 {flaggedQuestions.includes(quizQuestions[quizIndex].id) ? 'FLAGGED' : 'FLAG'}
                            </button>
                            <div className="quiz-timer">
                                <Icon name="clock" /> {Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    <div className="progress-bar-container" style={{ height: '4px' }}>
                        <div className="progress-bar-fill" style={{ width: `${((quizIndex) / quizQuestions.length) * 100}%` }}></div>
                    </div>

                    <div className="quiz-question-text">
                        {quizQuestions[quizIndex].question}
                    </div>

                    <div className="quiz-options">
                        {quizQuestions[quizIndex].quizOptions.map((opt, i) => {
                            let btnClass = "";
                            if (quizAnswered) {
                                if (i === quizQuestions[quizIndex].quizAnswerIndex) {
                                    btnClass = "correct";
                                } else if (i === quizSelectedOption) {
                                    btnClass = "incorrect";
                                }
                            } else if (quizSelectedOption === i) {
                                btnClass = "selected";
                            }

                            return (
                                <button 
                                    key={i}
                                    className={`quiz-option-btn ${btnClass}`}
                                    onClick={() => handleSelectQuizOption(i)}
                                    disabled={quizAnswered}
                                    type="button"
                                >
                                    <span>{opt}</span>
                                    {quizAnswered && i === quizQuestions[quizIndex].quizAnswerIndex && <Icon name="check" style={{ color: '#00ff66' }} />}
                                </button>
                            );
                        })}
                    </div>

                    {quizAnswered && (
                        <div className="quiz-feedback-box">
                            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                                {quizSelectedOption === quizQuestions[quizIndex].quizAnswerIndex ? "✓ CORRECT RESOLUTION" : "✗ EXCEPTION DETECTED"}
                            </h4>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                                {quizQuestions[quizIndex].answer}
                            </p>
                            <button 
                                className="action-btn" 
                                style={{ marginLeft: 'auto' }}
                                onClick={handleNextQuizQuestion}
                                type="button"
                            >
                                {quizIndex === quizQuestions.length - 1 ? "FINISH EXAM" : "NEXT QUESTION"} <Icon name="arrowRight" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Quiz Score results page / certificate */}
            {!quizActive && showCert && (
                <div style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--bg-panel)', border: '1px solid var(--border-muted)', borderRadius: '16px', padding: '2.5rem', boxShadow: 'var(--glow-primary)', backdropFilter: 'blur(16px)' }}>
                    <div className="certificate-frame">
                        <div className="certificate-watermark">IBM</div>
                        <h3 className="cert-title">CERTIFICATE OF MASTERY</h3>
                        <div className="cert-subtitle">z/OS Mainframe Operations</div>
                        
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>This certifies that</div>
                        <div className="cert-name">{userName || "Mainframe Professional"}</div>
                        
                        <p className="cert-text">
                            has successfully passed the comprehensive assessment for the <strong>{quizCategory === 'ALL' ? 'Mixed Mainframe Stack' : `${quizCategory} Specialist`}</strong>, demonstrating advanced understanding of Enterprise System architectures, database integrations, and transaction lifecycles.
                        </p>
                        
                        <div className="cert-meta">
                            <div className="cert-sig">
                                <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: 'var(--text-light)', fontStyle: 'italic' }}>mainframeOS</span>
                                <div className="cert-sig-line"></div>
                                <span className="cert-sig-label">Simulator Authority</span>
                            </div>
                            <div className="cert-badge">
                                {Math.round((quizScore / totalQuestionsCount) * 100)}%
                            </div>
                            <div className="cert-sig">
                                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-light)' }}>
                                    {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                <div className="cert-sig-line"></div>
                                <span className="cert-sig-label">Date Completed</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button 
                            className="action-btn"
                            onClick={() => { setShowCert(false); setQuizActive(false); }}
                            type="button"
                        >
                            Return to Simulator
                        </button>
                        <button 
                            className="action-btn"
                            style={{ backgroundColor: 'var(--badge-bg)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                            onClick={() => handleStartQuiz(quizCategory, quizDifficulty, quizLength)}
                            type="button"
                        >
                            Retake Exam
                        </button>
                    </div>
                </div>
            )}

            {!quizActive && (!showCert || showCert) && quizQuestions.length > 0 && quizIndex >= quizQuestions.length - 1 && (
                <div style={{ maxWidth: '680px', margin: '2rem auto', background: 'var(--bg-panel)', border: '1px solid var(--border-muted)', borderRadius: '12px', padding: '1.5rem', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                        📋 DETAILED EXAM REPORT
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {quizHistory.map((historyItem, idx) => {
                            const q = quizQuestions.find(q => q.id === historyItem.questionId) || quizQuestions[idx];
                            const isFlagged = flaggedQuestions.includes(q.id);
                            
                            return (
                                <div key={idx} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${historyItem.isCorrect ? '#00ff41' : '#ff4444'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                                            Q{idx + 1}. {q.question}
                                        </div>
                                        {isFlagged && <span style={{ color: '#ffaa00', fontSize: '0.8rem' }}>🚩 FLAGGED</span>}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        <span style={{ color: historyItem.isCorrect ? '#00ff41' : '#ff4444' }}>
                                            Your Answer: {q.quizOptions[historyItem.selectedOption] || "No Answer"}
                                        </span>
                                    </div>
                                    {!historyItem.isCorrect && (
                                        <div style={{ fontSize: '0.85rem', color: '#00ff41' }}>
                                            Correct Answer: {q.quizOptions[q.quizAnswerIndex]}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                        Explanation: {q.answer}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button 
                            className="action-btn" 
                            style={{ margin: '0 auto' }}
                            onClick={() => handleStartQuiz(quizCategory, quizDifficulty, quizLength)}
                            type="button"
                        >
                            Retake Exam
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
