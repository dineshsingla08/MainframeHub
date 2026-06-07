import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

export const CommandPalette = ({ questions, starred, toggleStarred, onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const inputRef = useRef(null);

    // Focus input on open
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Filtered matches
    const getMatches = () => {
        if (!query.trim()) return [];
        const cleanQuery = query.toLowerCase();
        return questions.filter(q => 
            q.question.toLowerCase().includes(cleanQuery) ||
            q.answer.toLowerCase().includes(cleanQuery) ||
            q.category.toLowerCase().includes(cleanQuery)
        ).slice(0, 30); // Max 30 matches for display speed
    };

    const matches = getMatches();
    const activeQuestion = questions.find(q => q.id === selectedQuestionId) || matches[0];

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="cmd-palette-backdrop" onClick={onClose}>
            <div className="cmd-palette-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header terminal bar */}
                <div className="cmd-palette-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                        <span className="status-dot"></span>
                        z/OS SYSTEM UTILITY — QUERY AND FIND REFERENCE
                    </span>
                    <button className="cmd-close-btn" onClick={onClose}>ESC ✕</button>
                </div>

                {/* Input Search Field */}
                <div className="cmd-input-container">
                    <span className="cmd-prompt">&gt; FIND</span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        className="cmd-input-field"
                        placeholder="Type keywords (e.g. COBOL COMP-3, JCL SORT, SQL DENSE_RANK)..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedQuestionId(null); // Reset active detail view on query change
                        }}
                    />
                </div>

                {/* Query Results & Preview columns */}
                <div className="cmd-workspace-grid">
                    {/* Left Column: List of matches */}
                    <div className="cmd-results-list">
                        {query.trim() === '' ? (
                            <div className="cmd-placeholder">
                                <p style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>READY FOR SEARCH INPUT.</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Type keywords to search across the catalog of 1,046 production interview questions.
                                </p>
                            </div>
                        ) : matches.length === 0 ? (
                            <div className="cmd-placeholder" style={{ color: '#ef4444' }}>
                                NO MATCHING RECORDS FOUND IN CATALOG.
                            </div>
                        ) : (
                            matches.map(q => {
                                const isStarred = starred.includes(q.id);
                                return (
                                    <div 
                                        key={q.id}
                                        className={`cmd-item-row ${activeQuestion?.id === q.id ? 'active' : ''}`}
                                        onClick={() => setSelectedQuestionId(q.id)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="badge badge-category" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>{q.category}</span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{q.level}</span>
                                        </div>
                                        <div className="cmd-item-title">{q.question}</div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                                            {isStarred && <span style={{ color: 'var(--accent-color)', fontSize: '0.75rem' }}>★ Bookmarked</span>}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Right Column: Active question preview */}
                    <div className="cmd-preview-detail">
                        {activeQuestion ? (
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                                    <div>
                                        <span className="badge badge-category" style={{ marginRight: '0.5rem' }}>{activeQuestion.category}</span>
                                        <span className={`badge ${
                                            activeQuestion.level === 'Beginner' ? 'badge-difficulty-beginner' :
                                            activeQuestion.level === 'Intermediate' ? 'badge-difficulty-intermediate' : 'badge-difficulty-expert'
                                        }`}>{activeQuestion.level}</span>
                                    </div>
                                    <button 
                                        className={`star-btn-icon ${starred.includes(activeQuestion.id) ? 'active' : ''}`}
                                        onClick={() => toggleStarred(activeQuestion.id)}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: starred.includes(activeQuestion.id) ? 'var(--accent-color)' : 'var(--text-secondary)' }}
                                    >
                                        {starred.includes(activeQuestion.id) ? '★' : '☆'}
                                    </button>
                                </div>

                                <h4 style={{ color: 'var(--text-light)', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>
                                    {activeQuestion.question}
                                </h4>

                                <div className="cmd-scrollable-body" style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    <p className="answer-content" style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-light)', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                                        {activeQuestion.answer}
                                    </p>

                                    {activeQuestion.code && (
                                        <div style={{ position: 'relative', margin: '1rem 0' }}>
                                            <button 
                                                className="copy-btn"
                                                onClick={() => handleCopy(activeQuestion.code, activeQuestion.id)}
                                                style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', background: 'var(--bg-panel-hover)', border: '1px solid var(--border-muted)', color: copiedId === activeQuestion.id ? '#00ff66' : 'var(--text-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                                            >
                                                {copiedId === activeQuestion.id ? '✓ COPIED!' : '📋 COPY'}
                                            </button>
                                            <pre className="code-block" style={{ margin: 0, padding: '1rem', fontSize: '0.8rem' }}>
                                                <code>{activeQuestion.code}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {activeQuestion.tip && (
                                        <div className="tip-box" style={{ marginTop: '1rem' }}>
                                            <Icon name="star" className="tip-box-icon" />
                                            <div>
                                                <div className="logo-subtitle" style={{ fontSize: '0.65rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>ARCHITECT TIP</div>
                                                <p className="tip-text" style={{ fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                                                    {activeQuestion.tip}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="cmd-preview-empty">
                                SELECT A SEARCH RESULT CARD TO VIEW FULL DETAILS, EXPLANATION, COPY CODE TEMPLATES, OR STAR FOR LATER REVIEW.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
