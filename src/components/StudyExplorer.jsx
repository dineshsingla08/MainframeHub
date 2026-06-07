import React, { useState } from 'react';
import { Icon } from './Icon';

export const StudyExplorer = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    openAccordionId,
    setOpenAccordionId,
    mastered,
    toggleMastered,
    needsReview,
    toggleNeedsReview,
    starred = [],
    toggleStarred,
    getFilteredQuestions
}) => {
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    
    // Format Code for Highlight rendering
    const highlightText = (text, highlight) => {
        if (!highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    part.toLowerCase() === highlight.toLowerCase() 
                        ? <mark key={i}>{part}</mark> 
                        : part
                )}
            </span>
        );
    };

    // Copy Code Helper
    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        const btn = document.getElementById(`copy-btn-${id}`);
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = `✓ COPIED!`;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 1500);
        }
    };

    let filtered = getFilteredQuestions();
    if (showStarredOnly) {
        filtered = filtered.filter(q => starred.includes(q.id));
    }

    return (
        <div>
            {/* Search & Filters */}
            <div className="filter-section">
                <div className="filter-row">
                    <div className="search-container">
                        {/* Custom search icon */}
                        <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px'}}>
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search by topic, keyword (e.g. COMP-3, S0C7, locks, cursors)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="filter-row">
                    <span className="filter-label">Category:</span>
                    <div className="pill-group">
                        {['ALL', 'COBOL', 'JCL', 'VSAM', 'DB2', 'CICS', 'SQL'].map(cat => (
                            <button 
                                key={cat} 
                                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="filter-row">
                    <span className="filter-label">Difficulty:</span>
                    <div className="pill-group">
                        {['ALL', 'Beginner', 'Intermediate', 'Expert'].map(lvl => (
                            <button 
                                key={lvl} 
                                className={`filter-pill ${selectedLevel === lvl ? 'active' : ''}`}
                                onClick={() => setSelectedLevel(lvl)}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="filter-row">
                    <span className="filter-label">Bookmarks:</span>
                    <div className="pill-group">
                        <button 
                            className={`filter-pill ${showStarredOnly ? 'active' : ''}`}
                            onClick={() => setShowStarredOnly(!showStarredOnly)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: showStarredOnly ? 'var(--accent-color)' : 'var(--border-muted)' }}
                        >
                            ★ Show Starred Only ({starred.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Questions List */}
            <div className="question-list">
                {filtered.length > 0 ? (
                    filtered.map(q => {
                        const isOpen = openAccordionId === q.id;
                        const isMastered = mastered.includes(q.id);
                        const isReview = needsReview.includes(q.id);
                        const isStarred = starred.includes(q.id);
                        
                        return (
                            <div key={q.id} className={`question-card ${isOpen ? 'open' : ''}`} style={{ borderLeft: isMastered ? '4px solid #00ff66' : isReview ? '4px solid #ffaa00' : '1px solid var(--border-muted)' }}>
                                <button 
                                    className="card-header-btn"
                                    onClick={() => setOpenAccordionId(isOpen ? null : q.id)}
                                    type="button"
                                >
                                    <div className="question-info-block">
                                        <div className="card-badges">
                                            <span className="badge badge-category">{q.category}</span>
                                            <span className={`badge badge-difficulty-${q.level.toLowerCase()}`}>{q.level}</span>
                                            {isMastered && <span className="badge" style={{ backgroundColor: 'rgba(0, 255, 102, 0.15)', color: '#00ff66' }}>MASTERED</span>}
                                            {isReview && <span className="badge" style={{ backgroundColor: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00' }}>REVIEW</span>}
                                        </div>
                                        <div className="question-text">
                                            {highlightText(q.question, searchQuery)}
                                        </div>
                                    </div>

                                    {/* Action layout containing Bookmark Toggle and Chevron */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <button 
                                            type="button"
                                            className={`star-btn-icon ${isStarred ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); toggleStarred(q.id); }}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', padding: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isStarred ? 'var(--accent-color)' : 'var(--text-secondary)' }}
                                        >
                                            {isStarred ? '★' : '☆'}
                                        </button>
                                        <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                </button>
                                
                                {isOpen && (
                                    <div className="card-body">
                                        <h4 className="answer-heading">DETAILED TECHNICAL RESPONSE</h4>
                                        <div className="answer-content">
                                            {highlightText(q.answer, searchQuery)}
                                        </div>

                                        {q.code && (
                                            <div className="code-container">
                                                <div className="code-header">
                                                    <span className="code-title">{q.category} Reference Layout</span>
                                                    <button 
                                                        id={`copy-btn-${q.id}`} 
                                                        className="copy-btn"
                                                        onClick={() => copyToClipboard(q.code, q.id)}
                                                        type="button"
                                                    >
                                                        <Icon name="copy" /> COPY CODE
                                                    </button>
                                                </div>
                                                <pre className="code-block">{q.code}</pre>
                                            </div>
                                        )}

                                        {q.tip && (
                                            <div className="tip-box">
                                                <Icon name="info" className="tip-box-icon" />
                                                <div className="tip-text">
                                                    <strong>INTERVIEW DEEP-DIVE:</strong> {q.tip}
                                                </div>
                                            </div>
                                        )}

                                        <div className="card-actions">
                                            <button 
                                                className={`action-btn ${isMastered ? 'mastered-active' : ''}`}
                                                onClick={() => toggleMastered(q.id)}
                                                type="button"
                                            >
                                                <Icon name="check" /> {isMastered ? 'Mastered!' : 'Mark as Mastered'}
                                            </button>
                                            <button 
                                                className={`action-btn ${isReview ? 'review-active' : ''}`}
                                                onClick={() => toggleNeedsReview(q.id)}
                                                type="button"
                                            >
                                                <Icon name="star" /> {isReview ? 'Flagged for Review' : 'Flag for Review'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No interview questions matched your query</h3>
                        <p style={{ fontSize: '0.9rem' }}>Try clearing the search query or adjusting the filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
