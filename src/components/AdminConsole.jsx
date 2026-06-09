import React, { useState, useEffect } from 'react';

export const AdminConsole = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('mf_auth_token');

    try {
      const res = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch users database.');
      }

      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`WARNING: Are you sure you want to delete user @${name} (ID: ${id})? This will permanently delete their account and all related statistics.`)) {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('mf_auth_token');

      try {
        const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to delete user.');
        }

        setSuccess(`User @${name} was deleted successfully.`);
        fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 'calc(100vh - 140px)' }}>
      {/* HEADER CARD */}
      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', color: 'var(--accent-color)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚙️</span> SYS.DB ADMIN CONSOLE
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Administrator view of all registered MainframeHub users and active database accounts.
            </p>
          </div>
          <button 
            onClick={fetchUsers} 
            className="action-btn"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          >
            🔄 REFRESH DATA
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid #ff444455',
            padding: '0.6rem',
            borderRadius: '4px',
            color: '#ff4444',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            marginTop: '0.5rem'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(0, 255, 65, 0.1)',
            border: '1px solid #00ff4155',
            padding: '0.6rem',
            borderRadius: '4px',
            color: '#00ff41',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            marginTop: '0.5rem'
          }}>
            ✓ {success}
          </div>
        )}
      </div>

      {/* DATABASE TABLE CARD */}
      <div className="card-panel" style={{ flex: 1, padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            ⏳ QUERYING USER_MASTER DATABASE...
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            NO USERS REGISTERED IN DATA STORAGE.
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            textAlign: 'left',
            color: 'var(--text-primary)'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-muted)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>USERNAME</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>EMAIL ADDRESS</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>ROLE</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>CREATED AT</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>XP SCORE</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>MASTERED</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>REVIEW</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const masteredCount = u.mastered ? JSON.parse(u.mastered).length : 0;
                const reviewCount = u.needs_review ? JSON.parse(u.needs_review).length : 0;
                const isAdmin = u.role === 'admin';
                const createdDate = new Date(u.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={u.id} style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: isAdmin ? 'rgba(0, 255, 65, 0.02)' : 'transparent'
                  }}>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>{u.id}</td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: '800' }}>@{u.username}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        fontWeight: '700',
                        border: '1px solid',
                        background: isAdmin ? 'rgba(0, 255, 65, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        borderColor: isAdmin ? '#00ff41' : 'var(--border-muted)',
                        color: isAdmin ? '#00ff41' : 'var(--text-secondary)'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{createdDate}</td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', fontWeight: '800', color: 'var(--accent-color)' }}>{u.score || 0} XP</td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', color: '#00ff41' }}>{masteredCount}</td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', color: '#ffaa00' }}>{reviewCount}</td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                      {!isAdmin && (
                        <button 
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          style={{
                            background: 'rgba(255, 68, 68, 0.1)',
                            border: '1px solid #ff4444',
                            color: '#ff4444',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            fontFamily: 'var(--font-mono)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#ff4444';
                            e.target.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 68, 68, 0.1)';
                            e.target.style.color = '#ff4444';
                          }}
                        >
                          DELETE
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
