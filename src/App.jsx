import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudyExplorer } from './components/StudyExplorer';
import { Flashcards } from './components/Flashcards';
import { ExamCenter } from './components/ExamCenter';
import { CodingSandbox } from './components/CodingSandbox';
import { ArchitectureDiagrams } from './components/ArchitectureDiagrams';
import { CommandPalette } from './components/CommandPalette';
import { TutorialsHub } from './components/TutorialsHub';
import { CareerRoadmap } from './components/CareerRoadmap';
import { MockInterview } from './components/MockInterview';
import { SQLPracticeLab } from './components/SQLPracticeLab';
import { ResourceLibrary } from './components/ResourceLibrary';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { AbendSolver } from './components/AbendSolver';
import { Scenarios } from './components/Scenarios';
import { Forum } from './components/Forum';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { allQuestions as questionsData } from './data/questions';
import { AdminConsole } from './components/AdminConsole';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { About } from './components/About';
import { Leaderboard } from './components/Leaderboard';
import { Careers } from './components/Careers';
import { Feedback } from './components/Feedback';
import { Blogs } from './components/Blogs';
import './index.css';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [theme, setTheme] = useState('green');

    // Auth States
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('mf_auth_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => {
        return localStorage.getItem('mf_auth_token') || null;
    });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    
    // Search and Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedLevel, setSelectedLevel] = useState('ALL');
    
    // Accordion State
    const [openAccordionId, setOpenAccordionId] = useState(null);

    // User Progress Lists (Stored in localStorage)
    const [mastered, setMastered] = useState(() => {
        const saved = localStorage.getItem('mf_mastered');
        return saved ? JSON.parse(saved) : [];
    });
    const [needsReview, setNeedsReview] = useState(() => {
        const saved = localStorage.getItem('mf_needs_review');
        return saved ? JSON.parse(saved) : [];
    });
    const [starred, setStarred] = useState(() => {
        const saved = localStorage.getItem('mf_starred');
        return saved ? JSON.parse(saved) : [];
    });

    // Flashcard States
    const [fcDeck, setFcDeck] = useState([]);
    const [fcIndex, setFcIndex] = useState(0);
    const [fcFlipped, setFcFlipped] = useState(false);

    // Quiz States
    const [quizActive, setQuizActive] = useState(false);
    const [quizCategory, setQuizCategory] = useState('ALL');
    const [quizDifficulty, setQuizDifficulty] = useState('ALL');
    const [quizLength, setQuizLength] = useState(10);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizSelectedOption, setQuizSelectedOption] = useState(null);
    const [quizAnswered, setQuizAnswered] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [quizTimer, setQuizTimer] = useState(0);
    const [quizTimerId, setQuizTimerId] = useState(null);
    const [quizHistory, setQuizHistory] = useState([]);
    const [flaggedQuestions, setFlaggedQuestions] = useState([]);
    const [userName, setUserName] = useState('');
    const [showCert, setShowCert] = useState(false);

    // Global Command Palette State
    const [showCommandPalette, setShowCommandPalette] = useState(false);

    // Tutorials Navigation State
    const [activeTutorialTopic, setActiveTutorialTopic] = useState(null);

    // Tab reset keys to force remount
    const [tabKeys, setTabKeys] = useState({});

    // Fetch progress on mount/token change
    useEffect(() => {
        if (token) {
            fetchProgress(token);
        }
    }, [token]);

    // Track site visits reactively
    useEffect(() => {
        const recordVisit = async () => {
            try {
                await fetch('http://localhost:5000/api/analytics/hit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user ? user.username : 'Guest' })
                });
            } catch (err) {
                console.error('Error recording analytics hit:', err);
            }
        };
        recordVisit();
    }, [user?.username]);


    const fetchProgress = async (authToken) => {
        try {
            const res = await fetch('http://localhost:5000/api/progress', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.mastered) setMastered(data.mastered);
                if (data.needs_review) setNeedsReview(data.needs_review);
                if (data.starred) setStarred(data.starred);
            }
        } catch (err) {
            console.error('Error fetching progress:', err);
        }
    };

    const syncProgress = async (m, nr, s) => {
        if (!token) return;
        try {
            await fetch('http://localhost:5000/api/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mastered: m, needs_review: nr, starred: s, score: m.length * 10 })
            });
        } catch (err) {
            console.error('Error syncing progress:', err);
        }
    };

    // Synchronize LocalStorage & Backend
    useEffect(() => {
        localStorage.setItem('mf_mastered', JSON.stringify(mastered));
        syncProgress(mastered, needsReview, starred);
    }, [mastered]);

    useEffect(() => {
        localStorage.setItem('mf_needs_review', JSON.stringify(needsReview));
        syncProgress(mastered, needsReview, starred);
    }, [needsReview]);

    useEffect(() => {
        localStorage.setItem('mf_starred', JSON.stringify(starred));
        syncProgress(mastered, needsReview, starred);
    }, [starred]);

    // Sync HTML theme class to document body
    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(`theme-${theme}`);
    }, [theme]);



    // Initialize Flashcard Deck
    useEffect(() => {
        let deck = questionsData;
        if (selectedCategory !== 'ALL') {
            deck = deck.filter(q => q.category === selectedCategory);
        }
        if (selectedLevel !== 'ALL') {
            deck = deck.filter(q => q.level === selectedLevel);
        }
        deck = [...deck].sort(() => Math.random() - 0.5);
        setFcDeck(deck);
        setFcIndex(0);
        setFcFlipped(false);
    }, [selectedCategory, selectedLevel, activeTab]);

    // Quiz Timer Logic
    useEffect(() => {
        if (quizActive && !quizAnswered) {
            const id = setInterval(() => {
                setQuizTimer(prev => prev + 1);
            }, 1000);
            setQuizTimerId(id);
            return () => clearInterval(id);
        }
    }, [quizActive, quizAnswered, quizIndex]);

    // Ctrl+K key listener for Command Palette
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowCommandPalette(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleMastered = (id) => {
        if (mastered.includes(id)) {
            setMastered(prev => prev.filter(item => item !== id));
        } else {
            setMastered(prev => [...prev, id]);
            setNeedsReview(prev => prev.filter(item => item !== id));
        }
    };

    const toggleNeedsReview = (id) => {
        if (needsReview.includes(id)) {
            setNeedsReview(prev => prev.filter(item => item !== id));
        } else {
            setNeedsReview(prev => [...prev, id]);
            setMastered(prev => prev.filter(item => item !== id));
        }
    };

    const toggleStarred = (id) => {
        if (starred.includes(id)) {
            setStarred(prev => prev.filter(item => item !== id));
        } else {
            setStarred(prev => [...prev, id]);
        }
    };

    const handleResetAllProgress = () => {
        if (window.confirm("Are you sure you want to reset all your learning statistics? This will clear your Mastered, Needs Review, and Starred logs.")) {
            setMastered([]);
            setNeedsReview([]);
            setStarred([]);
            syncProgress([], [], []);
        }
    };

    const handleLoginSuccess = (loginUser, loginToken) => {
        setUser(loginUser);
        setToken(loginToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('mf_auth_token');
        localStorage.removeItem('mf_auth_user');
        setUser(null);
        setToken(null);
        setMastered([]);
        setNeedsReview([]);
        setStarred([]);
        setActiveTab('dashboard');
    };

    const handleTabSwitch = (tabId) => {
        if (quizActive) {
            if (window.confirm("You are currently taking an exam. Leaving this tab will abort your progress and forfeit the mock score. Are you sure you want to exit?")) {
                setQuizActive(false);
                setActiveTab(tabId);
                if (tabId !== 'tutorials') setActiveTutorialTopic(null);
            }
        } else {
            if (activeTab === tabId) {
                // If user clicks the same tab again, reset its state by changing its key
                setTabKeys(prev => ({ ...prev, [tabId]: (prev[tabId] || 0) + 1 }));
            }
            setActiveTab(tabId);
            if (tabId !== 'tutorials') setActiveTutorialTopic(null);
        }
    };

    const handleNavigateToTutorial = (topic) => {
        setActiveTutorialTopic(topic);
        setActiveTab('tutorials');
    };

    const getFilteredQuestions = () => {
        return questionsData.filter(q => {
            const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
            const matchesLevel = selectedLevel === 'ALL' || q.level === selectedLevel;
            const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                   q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   q.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesLevel && matchesSearch;
        });
    };

    const handleStartQuiz = (category, difficulty = 'ALL', length = 10) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        let pool = questionsData;
        if (category !== 'ALL') pool = pool.filter(q => q.category === category);
        if (difficulty !== 'ALL') pool = pool.filter(q => q.level === difficulty);
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, length);
        setQuizQuestions(shuffled);
        setQuizIndex(0);
        setQuizActive(true);
        setQuizSelectedOption(null);
        setQuizAnswered(false);
        setQuizScore(0);
        setQuizTimer(0);
        setQuizHistory([]);
        setFlaggedQuestions([]);
        setShowCert(false);
    };

    const handleSelectQuizOption = (optionIndex) => {
        if (quizAnswered) return;
        setQuizSelectedOption(optionIndex);
        setQuizAnswered(true);
        clearInterval(quizTimerId);
        const currentQuestion = quizQuestions[quizIndex];
        const isCorrect = optionIndex === currentQuestion.quizAnswerIndex;
        if (isCorrect) setQuizScore(prev => prev + 1);
        setQuizHistory(prev => [...prev, {
            questionId: currentQuestion.id,
            selectedOption: optionIndex,
            isCorrect: isCorrect
        }]);
    };

    const handleNextQuizQuestion = async () => {
        if (quizIndex < quizQuestions.length - 1) {
            setQuizIndex(prev => prev + 1);
            setQuizSelectedOption(null);
            setQuizAnswered(false);
        } else {
            setQuizActive(false);
            const passScore = Math.ceil(quizQuestions.length * 0.8);
            if (quizScore >= passScore) setShowCert(true);

            // Send Email Report
            if (user && user.email) {
                let reportStr = quizHistory.map((h, i) => {
                    const q = quizQuestions[i];
                    return `Q${i+1}: ${q.question}\nYour Answer: ${q.quizOptions[h.selectedOption]}\nCorrect Answer: ${q.quizOptions[q.quizAnswerIndex]}\n`;
                }).join('\n');

                try {
                    await fetch('http://localhost:5000/api/progress/send-exam-report', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            userEmail: user.email,
                            category: quizCategory,
                            score: quizScore,
                            total: quizQuestions.length,
                            reportDetails: reportStr
                        })
                    });
                } catch(e) {
                    console.error("Failed to send exam report email", e);
                }
            }
        }
    };

    const getCategoryProgress = (category) => {
        const total = questionsData.filter(q => q.category === category).length;
        const masteredCount = questionsData.filter(q => q.category === category && mastered.includes(q.id)).length;
        return total > 0 ? Math.round((masteredCount / total) * 100) : 0;
    };

    const totalQuestions = questionsData.length;
    const masteredPercentage = Math.round((mastered.length / totalQuestions) * 100) || 0;
    const reviewPercentage = Math.round((needsReview.length / totalQuestions) * 100) || 0;

    // Tab labels for the header
    const TAB_LABELS = {
        dashboard: 'Overview',
        analytics: 'Progress Analytics',
        about: 'About Us',
        leaderboard: 'Mainframe Leaderboard',
        explorer: 'Study Explorer',
        flashcards: 'Flashcards',
        tutorials: 'Tutorials Hub',
        abendsolver: 'Abend Solver',
        quiz: 'Exam Center',
        interview: 'Mock Interview',
        sandbox: 'Coding Sandbox',
        sqllab: 'SQL Practice Lab',
        scenarios: 'Incident Scenarios',
        roadmap: 'Career Roadmap',
        resources: 'Resource Library',
        careers: 'Mainframe Careers',
        architecture: 'System Diagrams',
        forum: 'Community Forum',
        blogs: 'Blogs',
        admin: 'Admin Console',
        feedback: 'User Feedback',
    };

    return (
        <div className="app-container">
            {/* SIDEBAR NAVIGATION */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={handleTabSwitch} 
                handleResetAllProgress={handleResetAllProgress} 
                user={user}
            />

            {/* MAIN WORKSPACE */}
            <div className="workspace">
                {/* TOP BAR CONTROLS */}
                <div className="workspace-content" key={activeTab}>
                <div className="top-bar">
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                        &gt;_ {TAB_LABELS[activeTab] || activeTab.toUpperCase()}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* COMMAND PALETTE TRIGGER */}
                        <button 
                            className="action-btn"
                            onClick={() => setShowCommandPalette(true)}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}
                        >
                            ⌨️ SEARCH (CTRL+K)
                        </button>
                        
                        <div className="theme-selector">
                            <button className={`theme-btn theme-btn-green ${theme === 'green' ? 'active' : ''}`} onClick={() => setTheme('green')}>IBM GREEN</button>
                            <button className={`theme-btn theme-btn-amber ${theme === 'amber' ? 'active' : ''}`} onClick={() => setTheme('amber')}>AMBER</button>
                            <button className={`theme-btn theme-btn-cyber ${theme === 'cyber' ? 'active' : ''}`} onClick={() => setTheme('cyber')}>COBALT</button>
                        </div>

                        {/* AUTHENTICATION SHIFTED TO TOP RIGHT */}
                        {user ? (
                            <div className="topbar-user" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                border: '1px solid var(--accent-color)',
                                background: 'rgba(var(--accent-rgb), 0.05)',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.75rem'
                            }}>
                                <span style={{ color: 'var(--text-secondary)' }}>USER:</span>
                                <span style={{ fontWeight: '800', color: 'var(--accent-color)' }}>@{user.username}</span>
                                <button 
                                    onClick={() => setShowChangePasswordModal(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        textDecoration: 'underline',
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: '700',
                                        padding: '0 0.4rem',
                                        borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                                        borderRight: '1px solid rgba(255, 255, 255, 0.15)'
                                    }}
                                >
                                    🔑 PASSWORD
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ff4444',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        textDecoration: 'underline',
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: '700',
                                        padding: '0 0 0 0.4rem'
                                    }}
                                >
                                    DISCONNECT
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="action-btn" 
                                onClick={() => setShowAuthModal(true)} 
                                style={{ 
                                    padding: '0.4rem 0.8rem', 
                                    fontSize: '0.72rem', 
                                    fontFamily: 'var(--font-mono)', 
                                    letterSpacing: '0.5px',
                                    background: 'rgba(var(--accent-rgb), 0.1)', 
                                    borderColor: 'var(--accent-color)', 
                                    color: 'var(--accent-color)',
                                    fontWeight: '800'
                                }}
                            >
                                🔑 LOGIN / REGISTER
                            </button>
                        )}
                    </div>
                </div>

                {/* TAB CONTENT PANELS */}
                {activeTab === 'dashboard' && (
                    <Dashboard 
                        questionsData={questionsData}
                        mastered={mastered}
                        needsReview={needsReview}
                        totalQuestions={totalQuestions}
                        masteredPercentage={masteredPercentage}
                        reviewPercentage={reviewPercentage}
                        getCategoryProgress={getCategoryProgress}
                        setActiveTab={handleTabSwitch}
                    />
                )}

                {activeTab === 'analytics' && (
                    <ProgressAnalytics
                        questionsData={questionsData}
                        mastered={mastered}
                        needsReview={needsReview}
                        starred={starred}
                        totalQuestions={totalQuestions}
                        masteredPercentage={masteredPercentage}
                        reviewPercentage={reviewPercentage}
                    />
                )}

                {activeTab === 'about' && (
                    <About setActiveTab={handleTabSwitch} />
                )}

                {activeTab === 'leaderboard' && (
                    <Leaderboard user={user} />
                )}

                {activeTab === 'explorer' && (
                    <StudyExplorer 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedLevel={selectedLevel}
                        setSelectedLevel={setSelectedLevel}
                        openAccordionId={openAccordionId}
                        setOpenAccordionId={setOpenAccordionId}
                        mastered={mastered}
                        toggleMastered={toggleMastered}
                        needsReview={needsReview}
                        toggleNeedsReview={toggleNeedsReview}
                        starred={starred}
                        toggleStarred={toggleStarred}
                        getFilteredQuestions={getFilteredQuestions}
                    />
                )}

                {activeTab === 'flashcards' && (
                    <Flashcards 
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedLevel={selectedLevel}
                        setSelectedLevel={setSelectedLevel}
                        fcDeck={fcDeck}
                        fcIndex={fcIndex}
                        setFcIndex={setFcIndex}
                        fcFlipped={fcFlipped}
                        setFcFlipped={setFcFlipped}
                        key={tabKeys['flashcards'] || 0}
                        mastered={mastered}
                        needsReview={needsReview}
                        toggleMastered={toggleMastered}
                        toggleNeedsReview={toggleNeedsReview}
                        starred={starred}
                        toggleStarred={toggleStarred}
                    />
                )}

                {activeTab === 'tutorials' && (
                    <TutorialsHub 
                        key={tabKeys['tutorials'] || 0}
                        initialCategory={activeTutorialTopic} 
                        clearInitialCategory={() => setActiveTutorialTopic(null)} 
                    />
                )}

                {activeTab === 'quiz' && (
                    <ExamCenter 
                        key={tabKeys['quiz'] || 0}
                        user={user}
                        quizActive={quizActive}
                        quizCategory={quizCategory}
                        setQuizCategory={setQuizCategory}
                        quizDifficulty={quizDifficulty}
                        setQuizDifficulty={setQuizDifficulty}
                        quizLength={quizLength}
                        setQuizLength={setQuizLength}
                        quizQuestions={quizQuestions}
                        quizIndex={quizIndex}
                        quizSelectedOption={quizSelectedOption}
                        quizAnswered={quizAnswered}
                        quizScore={quizScore}
                        quizTimer={quizTimer}
                        quizHistory={quizHistory}
                        showCert={showCert}
                        setShowCert={setShowCert}
                        setQuizActive={setQuizActive}
                        flaggedQuestions={flaggedQuestions}
                        setFlaggedQuestions={setFlaggedQuestions}
                        userName={userName}
                        setUserName={setUserName}
                        onStartQuiz={handleStartQuiz}
                        onSelectOption={handleSelectQuizOption}
                        onNextQuestion={handleNextQuizQuestion}
                        onPrevQuestion={handlePrevQuizQuestion}
                        onSubmitQuiz={handleSubmitQuiz}
                        onFlagQuestion={handleFlagQuestion}
                        onCloseCert={() => {
                            setShowCert(false);
                            setQuizActive(false);
                        }}
                    />
                )}

                {activeTab === 'interview' && <MockInterview key={tabKeys['interview'] || 0} user={user} onRequireAuth={() => setShowAuthModal(true)} />}

                {activeTab === 'sandbox' && <CodingSandbox key={tabKeys['sandbox'] || 0} />}

                {activeTab === 'sqllab' && <SQLPracticeLab key={tabKeys['sqllab'] || 0} />}

                {activeTab === 'roadmap' && <CareerRoadmap key={tabKeys['roadmap'] || 0} onNavigateToTutorial={handleNavigateToTutorial} />}

                {activeTab === 'resources' && <ResourceLibrary key={tabKeys['resources'] || 0} />}

                {activeTab === 'careers' && <Careers key={tabKeys['careers'] || 0} user={user} />}

                {activeTab === 'architecture' && <ArchitectureDiagrams key={tabKeys['architecture'] || 0} />}

                {activeTab === 'abendsolver' && <AbendSolver key={tabKeys['abendsolver'] || 0} />}

                {activeTab === 'scenarios' && <Scenarios key={tabKeys['scenarios'] || 0} />}

                {activeTab === 'feedback' && <Feedback key={tabKeys['feedback'] || 0} />}

                {activeTab === 'blogs' && <Blogs key={tabKeys['blogs'] || 0} user={user} />}

                {activeTab === 'forum' && (
                    <Forum 
                        key={tabKeys['forum'] || 0}
                        user={user}
                        setShowAuthModal={setShowAuthModal}
                    />
                )}

                {activeTab === 'admin' && user && (user.username === 'Dineshsingla08' || user.email === 'dineshsingla08@gmail.com') && <AdminConsole user={user} token={token} />}
                </div>{/* end workspace-content */}

                {/* FOOTER */}
                <Footer setActiveTab={(tab) => {
                    if (tab === activeTab) {
                        setTabKeys(prev => ({ ...prev, [tab]: (prev[tab] || 0) + 1 }));
                    }
                    handleTabSwitch(tab);
                }} />
            </div>

            {/* GLOBAL OVERLAYS */}
            {showCommandPalette && (
                <CommandPalette 
                    questions={questionsData}
                    starred={starred}
                    toggleStarred={toggleStarred}
                    onClose={() => setShowCommandPalette(false)}
                />
            )}

            {showAuthModal && (
                <AuthModal 
                    onClose={() => setShowAuthModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {showChangePasswordModal && (
                <ChangePasswordModal 
                    onClose={() => setShowChangePasswordModal(false)}
                />
            )}
        </div>
    );
}
