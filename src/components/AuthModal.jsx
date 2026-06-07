import React, { useState } from 'react';

export const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isRegister 
      ? 'http://localhost:5000/api/auth/register' 
      : 'http://localhost:5000/api/auth/login';

    const payload = isRegister 
      ? { username, email, password } 
      : { email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token
      localStorage.setItem('mf_auth_token', data.token);
      localStorage.setItem('mf_auth_user', JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="card-panel" style={{
        width: '400px',
        background: '#0d130d',
        border: '1px solid var(--accent-color)',
        boxShadow: '0 0 20px rgba(var(--accent-rgb), 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        padding: '2rem',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          &times;
        </button>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', color: 'var(--accent-color)', margin: 0 }}>
            ◈ {isRegister ? 'REGISTER' : 'LOGIN'}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {isRegister 
              ? 'Create a MainframeHub account to sync your stats.' 
              : 'Sign in to access community forum & sync progress.'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid #ff444455',
            padding: '0.6rem',
            borderRadius: '4px',
            color: '#ff4444',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)'
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>USERNAME</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="action-btn"
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '0.7rem', 
              marginTop: '0.5rem',
              fontWeight: '800'
            }}
          >
            {loading ? 'PROCESSING...' : isRegister ? 'CREATE ACCOUNT' : 'LOG IN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'Already have an account? ' : 'New to MainframeHub? '}
          </span>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-color)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
