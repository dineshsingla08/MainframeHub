import React, { useState, useEffect } from 'react';

export const Leaderboard = ({ user }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch((window.API_BASE || '') + '/api/progress/leaderboard');
      if (!res.ok) throw new Error('Failed to fetch leaderboard data.');
      const data = await res.json();
      setRankings(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredRankings = rankings.filter(r => 
    r.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadge = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRoleBadge = (role, username) => {
    if (username === 'Dineshsingla08' || role === 'admin') {
      return (
        <span style={{
          background: 'rgba(255,68,68,0.15)',
          border: '1px solid #ff4444',
          color: '#ff6b6b',
          fontSize: '0.62rem',
          padding: '0.1rem 0.4rem',
          borderRadius: '3px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 'bold',
          marginLeft: '0.5rem'
        }}>ADMIN</span>
      );
    }
    if (role === 'moderator') {
      return (
        <span style={{
          background: 'rgba(0,170,255,0.15)',
          border: '1px solid #00aaff',
          color: '#33bbfb',
          fontSize: '0.62rem',
          padding: '0.1rem 0.4rem',
          borderRadius: '3px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 'bold',
          marginLeft: '0.5rem'
        }}>MOD</span>
      );
    }
    return null;
  };

  // Extract Top 3 for Podium
  const topThree = rankings.slice(0, 3);

  return (
    <div style={{ padding: '0', maxWidth: '100%', overflowX: 'hidden' }}>

      {/* ── HEADER & SEARCH ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-muted)',
        paddingBottom: '1.2rem'
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0, letterSpacing: '1px' }}>
            GLOBAL LEADERBOARD
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
            Compare progress with mainframe professionals around the globe.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search username..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '0.55rem 0.8rem',
              border: '1px solid var(--border-muted)',
              background: 'rgba(0,0,0,0.3)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              borderRadius: '4px',
              width: '200px',
              outline: 'none'
            }}
          />
          <button 
            className="action-btn" 
            onClick={fetchLeaderboard}
            disabled={loading}
            style={{ padding: '0.55rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            🔄 {loading ? 'REFRESHING...' : 'REFRESH'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255,68,68,0.07)', border: '1px solid rgba(255,68,68,0.35)',
          padding: '0.8rem 1rem', borderRadius: '5px', color: '#ff6b6b',
          fontSize: '0.82rem', fontFamily: 'var(--font-mono)', marginBottom: '1.5rem'
        }}>❌ Error: {error}</div>
      )}

      {/* ── PODIUM DISPLAY (Top 3) ── */}
      {!loading && topThree.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '1.5rem',
          margin: '2.5rem 0 3.5rem 0',
          flexWrap: 'wrap'
        }}>
          {/* 2nd Place */}
          {topThree[1] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: '0.3rem',
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))'
              }}>🥈</div>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a0a0a0 0%, #303030 100%)',
                border: '2px solid #a0a0a0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.3rem',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 0 15px rgba(255,255,255,0.15)'
              }}>
                {topThree[1].username.slice(0, 2).toUpperCase()}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                @{topThree[1].username}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--accent-color)',
                marginTop: '0.2rem'
              }}>
                {topThree[1].score} pts
              </div>
              {/* Podium Column */}
              <div style={{
                width: '120px',
                height: '80px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderBottom: 'none',
                borderRadius: '6px 6px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: '900',
                fontSize: '1.8rem',
                color: '#a0a0a0',
                marginTop: '0.6rem'
              }}>2ND</div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.3rem',
                filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.4))',
                animation: 'pulse 2s infinite ease-in-out'
              }}>👑</div>
              <div style={{
                width: '82px',
                height: '82px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd700 0%, #504000 100%)',
                border: '2px solid #ffd700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.6rem',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 0 25px rgba(255,215,0,0.3)'
              }}>
                {topThree[0].username.slice(0, 2).toUpperCase()}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                fontWeight: '900',
                color: 'var(--text-primary)',
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                @{topThree[0].username}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--accent-color)',
                marginTop: '0.2rem',
                fontWeight: 'bold'
              }}>
                {topThree[0].score} pts
              </div>
              {/* Podium Column */}
              <div style={{
                width: '130px',
                height: '110px',
                background: 'rgba(255,215,0,0.06)',
                border: '1px solid rgba(255,215,0,0.2)',
                borderBottom: 'none',
                borderRadius: '6px 6px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: '900',
                fontSize: '2.2rem',
                color: '#ffd700',
                marginTop: '0.6rem',
                boxShadow: '0 -5px 15px rgba(255,215,0,0.04)'
              }}>1ST</div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: '0.3rem',
                filter: 'drop-shadow(0 0 8px rgba(205,127,50,0.2))'
              }}>🥉</div>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #cd7f32 0%, #3a200a 100%)',
                border: '2px solid #cd7f32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.3rem',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 0 15px rgba(205,127,50,0.15)'
              }}>
                {topThree[2].username.slice(0, 2).toUpperCase()}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                @{topThree[2].username}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--accent-color)',
                marginTop: '0.2rem'
              }}>
                {topThree[2].score} pts
              </div>
              {/* Podium Column */}
              <div style={{
                width: '120px',
                height: '65px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderBottom: 'none',
                borderRadius: '6px 6px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: '900',
                fontSize: '1.8rem',
                color: '#cd7f32',
                marginTop: '0.6rem'
              }}>3RD</div>
            </div>
          )}
        </div>
      )}

      {/* ── GRID LAYOUT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start', flexWrap: 'wrap' }}>
        
        {/* Leaderboard Table */}
        <div className="card-panel" style={{ padding: '0', overflowX: 'auto', border: '1px solid var(--border-muted)', borderRadius: '8px' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--accent-color)' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite', marginRight: '0.5rem' }}>⏳</span>
              RETRIEVING LEADERBOARD DATA...
            </div>
          ) : filteredRankings.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              NO RECORDS MATCHING "{searchQuery}"
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-muted)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>RANK</th>
                  <th style={{ padding: '1rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>PROFESSIONAL</th>
                  <th style={{ padding: '1rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)', textAlign: 'center' }}>MASTERED</th>
                  <th style={{ padding: '1rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)', textAlign: 'right' }}>TOTAL SCORE</th>
                </tr>
              </thead>
              <tbody>
                {filteredRankings.map((r, idx) => {
                  const isSelf = user && (user.username === r.username || user.email === r.email);
                  const rank = idx + 1;
                  return (
                    <tr 
                      key={r.id} 
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: isSelf ? 'rgba(0,255,65,0.04)' : 'transparent',
                        borderLeft: isSelf ? '3px solid var(--accent-color)' : 'none',
                        transition: 'background 0.2s'
                      }}
                      className={isSelf ? '' : 'table-row-hover'}
                    >
                      {/* Rank */}
                      <td style={{
                        padding: '1rem 1.2rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        fontWeight: rank <= 3 ? 'bold' : 'normal',
                        color: rank === 1 ? '#ffd700' : rank === 2 ? '#a0a0a0' : rank === 3 ? '#cd7f32' : 'var(--text-primary)'
                      }}>
                        {getRankBadge(rank)}
                      </td>
                      
                      {/* User & Badges */}
                      <td style={{ padding: '1rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            fontWeight: isSelf ? '800' : 'normal',
                            color: isSelf ? 'var(--accent-color)' : 'var(--text-primary)'
                          }}>
                            @{r.username}
                          </span>
                          {getRoleBadge(r.role, r.username)}
                          {isSelf && (
                            <span style={{
                              background: 'rgba(0,255,65,0.12)',
                              border: '1px solid var(--accent-color)',
                              color: 'var(--accent-color)',
                              fontSize: '0.58rem',
                              padding: '0.05rem 0.3rem',
                              borderRadius: '3px',
                              fontFamily: 'var(--font-mono)',
                              marginLeft: '0.5rem'
                            }}>YOU</span>
                          )}
                        </div>
                      </td>
                      
                      {/* Mastered / Progress */}
                      <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                            {r.masteredCount} qns
                          </span>
                          <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min(100, (r.masteredCount / 100) * 100)}%`,
                              height: '100%',
                              background: 'var(--accent-color)'
                            }} />
                          </div>
                        </div>
                      </td>
                      
                      {/* Score */}
                      <td style={{
                        padding: '1rem 1.2rem',
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        color: 'var(--accent-color)'
                      }}>
                        {r.score} PTS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Scoring Guide Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-panel" style={{ border: '1px solid var(--border-muted)' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-color)', letterSpacing: '1px', marginBottom: '0.8rem', fontWeight: 'bold' }}>
              🏆 POINT SYSTEM
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.8rem' }}>
              Your leaderboard score is synchronized automatically with your progress:
            </p>
            <ul style={{ padding: '0 0 0 1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li style={{ fontSize: '0.73rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--accent-color)' }}>+10 Points</strong> per Mastered question.
              </li>
              <li style={{ fontSize: '0.73rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text-secondary)' }}>0 Points</strong> for Review/Starred questions.
              </li>
            </ul>
            <div style={{
              background: 'rgba(0,255,65,0.03)',
              border: '1px solid rgba(0,255,65,0.1)',
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              marginTop: '1rem',
              fontSize: '0.68rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              fontFamily: 'var(--font-mono)'
            }}>
              💡 <em>Mastering more questions in Study Explorer, Flashcards, or coding sandbox increases your rank.</em>
            </div>
          </div>

          <div className="card-panel" style={{ border: '1px solid var(--border-muted)', background: 'linear-gradient(135deg, rgba(0,255,65,0.03) 0%, transparent 100%)' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-color)', letterSpacing: '1px', marginBottom: '0.6rem', fontWeight: 'bold' }}>
              🔥 LEADER STATS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Ranked:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{rankings.length} users</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Top Score:</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{rankings[0]?.score || 0} PTS</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
