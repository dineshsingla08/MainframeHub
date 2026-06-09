import React, { useState } from 'react';

export const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'bug',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', feedbackType: 'bug', message: '' });
      setTimeout(() => setStatus(null), 3000);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div className="metric-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
          💬 User Feedback
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
          We would love to hear your thoughts, feature requests, or bug reports to improve the platform.
        </p>

        {status === 'success' && (
          <div style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid #00ff41', color: '#00ff41', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            Thank you! Your feedback has been submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                YOUR NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-muted)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-muted)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
              FEEDBACK TYPE
            </label>
            <select
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-muted)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
            >
              <option value="bug">Report a Bug</option>
              <option value="feature">Feature Request</option>
              <option value="content">Content Suggestion / Correction</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
              MESSAGE
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-muted)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="action-btn"
            style={{
              padding: '1rem',
              background: 'var(--accent-color)',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '800',
              cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
              opacity: status === 'submitting' ? 0.7 : 1
            }}
          >
            {status === 'submitting' ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
          </button>
        </form>
      </div>
    </div>
  );
};
