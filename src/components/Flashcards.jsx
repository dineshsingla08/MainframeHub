import React from 'react';
import { Icon } from './Icon';

export const Flashcards = ({
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    fcDeck,
    fcIndex,
    setFcIndex,
    fcFlipped,
    setFcFlipped,
    mastered,
    toggleMastered,
    needsReview,
    toggleNeedsReview,
    starred = [],
    toggleStarred
}) => {
    return (
        <div>
            {/* Flashcard Settings Filter Banner */}
            <div className="filter-section" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="filter-label" style={{ minWidth: 'auto' }}>Deck Category:</span>
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ background: '#101726', border: '1px solid var(--border-muted)', color: 'var(--text-light)', padding: '0.4rem 0.8rem', borderRadius: '6px', outline: 'none' }}
                    >
                        {['ALL', 'COBOL', 'JCL', 'VSAM', 'DB2', 'CICS', 'SQL'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="filter-label" style={{ minWidth: 'auto' }}>Difficulty:</span>
                    <select 
                        value={selectedLevel} 
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        style={{ background: '#101726', border: '1px solid var(--border-muted)', color: 'var(--text-light)', padding: '0.4rem 0.8rem', borderRadius: '6px', outline: 'none' }}
                    >
                        {['ALL', 'Beginner', 'Intermediate', 'Expert'].map(lvl => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                    </select>
                </div>
            </div>

            {fcDeck.length > 0 ? (
                <div className="flashcard-deck-container">
                    <div 
                        className={`flashcard-scene ${fcFlipped ? 'is-flipped' : ''}`}
                        onClick={() => setFcFlipped(!fcFlipped)}
                    >
                        <div className="flashcard-inner">
                            {/* FRONT OF CARD */}
                            <div className="flashcard-face flashcard-front">
                                <span className="badge badge-category" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
                                    {fcDeck[fcIndex].category}
                                </span>
                                <span className={`badge badge-difficulty-${fcDeck[fcIndex].level.toLowerCase()}`} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                                    {fcDeck[fcIndex].level}
                                </span>
                                
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.5', maxWidth: '85%' }}>
                                    {fcDeck[fcIndex].question}
                                </h3>
                                
                                <div className="flashcard-instruction">CLICK TO REVEAL KEY ANSWER</div>
                            </div>

                            {/* BACK OF CARD */}
                            <div className="flashcard-face flashcard-back" onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
                                    <span className="badge badge-category">{fcDeck[fcIndex].category}</span>
                                    <button 
                                        className="action-btn" 
                                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => setFcFlipped(false)}
                                        type="button"
                                    >
                                        FLIP BACK
                                    </button>
                                </div>

                                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                                    {fcDeck[fcIndex].question}
                                </h4>

                                <div style={{ fontSize: '1rem', lineHeight: '1.65', color: 'var(--text-light)', overflowY: 'auto', maxHeight: '250px', paddingRight: '0.5rem' }}>
                                    {fcDeck[fcIndex].answer}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flashcard-deck-controls">
                        <button 
                            className="deck-btn"
                            onClick={() => { setFcIndex(prev => Math.max(0, prev - 1)); setFcFlipped(false); }}
                            disabled={fcIndex === 0}
                            type="button"
                        >
                            <Icon name="arrowLeft" /> Previous
                        </button>
                        
                        <div className="deck-indicator">
                            CARD {fcIndex + 1} OF {fcDeck.length}
                        </div>

                        <button 
                            className="deck-btn"
                            onClick={() => { setFcIndex(prev => Math.min(fcDeck.length - 1, prev + 1)); setFcFlipped(false); }}
                            disabled={fcIndex === fcDeck.length - 1}
                            type="button"
                        >
                            Next <Icon name="arrowRight" />
                        </button>
                    </div>

                    {/* Quick status loggers while inside flashcards */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button 
                            className={`action-btn ${mastered.includes(fcDeck[fcIndex].id) ? 'mastered-active' : ''}`}
                            onClick={() => toggleMastered(fcDeck[fcIndex].id)}
                            type="button"
                        >
                            <Icon name="check" /> Got It!
                        </button>
                        <button 
                            className={`action-btn ${needsReview.includes(fcDeck[fcIndex].id) ? 'review-active' : ''}`}
                            onClick={() => toggleNeedsReview(fcDeck[fcIndex].id)}
                            type="button"
                        >
                            <Icon name="star" /> Review Later
                        </button>
                        <button 
                            className="action-btn"
                            onClick={() => toggleStarred(fcDeck[fcIndex].id)}
                            type="button"
                            style={{ borderColor: starred.includes(fcDeck[fcIndex].id) ? 'var(--accent-color)' : '', color: starred.includes(fcDeck[fcIndex].id) ? 'var(--accent-color)' : '' }}
                        >
                            ★ {starred.includes(fcDeck[fcIndex].id) ? 'Bookmarked!' : 'Bookmark Card'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <Icon name="flashcard" className="empty-icon" />
                    <h3>No flashcards match your current filters</h3>
                    <p>Try switching to ALL categories or difficulties.</p>
                </div>
            )}
        </div>
    );
};
