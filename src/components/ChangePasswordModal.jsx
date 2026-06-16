import React, { useState } from 'react';

export const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('mf_auth_token');

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1500);
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
            ◈ UPDATE PASSWORD
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Modify security credentials for your mainframe session.
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

        {success && (
          <div style={{
            background: 'rgba(0, 255, 65, 0.1)',
            border: '1px solid #00ff4155',
            padding: '0.6rem',
            borderRadius: '4px',
            color: '#00ff41',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)'
          }}>
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>CURRENT PASSWORD</label>
            <input 
              type="password" 
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>NEW PASSWORD</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-muted)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>CONFIRM NEW PASSWORD</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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
            {loading ? 'UPDATING...' : 'CHANGE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
};
