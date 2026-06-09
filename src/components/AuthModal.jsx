import React, { useState, useEffect, useRef } from 'react';

const API = 'http://localhost:5000/api/auth';
// Replace with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.75rem',
  border: '1px solid var(--border-muted)',
  background: 'rgba(0,0,0,0.35)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.85rem',
  borderRadius: '4px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
};

const labelStyle = {
  fontSize: '0.68rem',
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-secondary)',
  letterSpacing: '1.5px',
  marginBottom: '0.25rem',
  display: 'block'
};

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.25rem' };

export const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const googleBtnRef = useRef(null);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    setError(''); setSuccess('');
    setLoading(true);
    try {
      if (mode === 'reg-otp') {
        const data = await post('send-registration-otp', { username, email, password });
        setSuccess('New verification code sent to ' + email);
        setResendTimer(60);
      } else if (mode === 'otp') {
        const data = await post('forgot-password', { emailOrUsername: email });
        setSuccess('New reset OTP sent to ' + email);
        setResendTimer(60);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load Google Identity Services script
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const scriptId = 'google-gsi';
    if (document.getElementById(scriptId)) {
      if (window.google) setGoogleReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Google button when ready
  useEffect(() => {
    if (!googleReady || !googleBtnRef.current || !window.google) return;
    if (!['login', 'register'].includes(mode)) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    googleBtnRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'filled_black',
      size: 'large',
      width: 340,
      text: mode === 'register' ? 'signup_with' : 'signin_with',
      shape: 'rectangular',
    });
  }, [googleReady, mode]);

  const handleGoogleResponse = async (response) => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await fetch(`${API}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

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

  const reset = () => { setError(''); setSuccess(''); setOtp(''); setNewPassword(''); setConfirmPassword(''); };
  const switchMode = (m) => { reset(); setMode(m); };

  const post = async (endpoint, body) => {
    const res = await fetch(`${API}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await post('login', { email, password });
        localStorage.setItem('mf_auth_token', data.token);
        localStorage.setItem('mf_auth_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
        onClose();
      } else if (mode === 'register') {
        const data = await post('send-registration-otp', { username, email, password });
        setSuccess(data.message);
        switchMode('reg-otp');
        setResendTimer(60);
      } else if (mode === 'reg-otp') {
        const data = await post('verify-registration-otp', { email, otp });
        setSuccess(data.message);
        switchMode('reg-success');
      } else if (mode === 'forgot') {
        const data = await post('forgot-password', { emailOrUsername: email });
        setSuccess(data.message);
        switchMode('otp');
        setResendTimer(60);
      } else if (mode === 'otp') {
        await post('verify-otp', { emailOrUsername: email, otp });
        setSuccess('OTP verified! Set your new password below.');
        setMode('reset');
      } else if (mode === 'reset') {
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
        const data = await post('reset-password', { emailOrUsername: email, otp, newPassword });
        setSuccess(data.message);
        setTimeout(() => switchMode('login'), 2500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: 'SIGN IN', register: 'CREATE ACCOUNT',
    'reg-otp': 'VERIFY EMAIL', 'reg-success': 'ACCOUNT CREATED',
    forgot: 'FORGOT PASSWORD', otp: 'ENTER OTP', reset: 'NEW PASSWORD'
  };
  const subtitles = {
    login: 'Sign in to sync your progress and access the community.',
    register: "Fill in your details — we'll send a verification code to your email.",
    'reg-otp': 'Enter the 4-digit code sent to your registered email.',
    'reg-success': 'Email verified! Your account is ready.',
    forgot: 'Enter your email or username to receive a reset OTP.',
    otp: 'Enter the 4-digit code sent to your email.',
    reset: 'Set a strong new password for your account.'
  };
  const btnLabels = {
    login: 'LOG IN', register: 'SEND VERIFICATION CODE',
    'reg-otp': 'VERIFY & CREATE ACCOUNT', forgot: 'SEND OTP',
    otp: 'VERIFY CODE', reset: 'RESET PASSWORD'
  };

  const showGoogleBtn = ['login', 'register'].includes(mode) && GOOGLE_CLIENT_ID;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.82)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999, backdropFilter: 'blur(8px)'
    }}>
      <div className="card-panel" style={{
        width: '430px', maxHeight: '92vh', overflowY: 'auto',
        background: 'linear-gradient(160deg, #070d07 0%, #0d1a0d 100%)',
        border: '1px solid var(--accent-color)',
        boxShadow: '0 0 60px rgba(var(--accent-rgb), 0.18), 0 20px 60px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', gap: '1.1rem',
        padding: '2rem', position: 'relative', borderRadius: '10px'
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none',
          color: 'var(--text-secondary)', cursor: 'pointer',
          fontSize: '1.3rem', fontFamily: 'var(--font-mono)', lineHeight: 1
        }}>×</button>

        {/* Header */}
        <div style={{ textAlign: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(var(--accent-rgb), 0.15)' }}>
          <div style={{ fontSize: '1.6rem', color: 'var(--accent-color)', marginBottom: '0.3rem' }}>◈</div>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontWeight: '900', color: 'var(--accent-color)', margin: 0, fontSize: '0.95rem', letterSpacing: '3px' }}>
            {titles[mode]}
          </h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.5 }}>
            {subtitles[mode]}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            background: 'rgba(255,68,68,0.07)', border: '1px solid rgba(255,68,68,0.35)',
            padding: '0.6rem 0.75rem', borderRadius: '5px', color: '#ff6b6b',
            fontSize: '0.77rem', fontFamily: 'var(--font-mono)', lineHeight: 1.5
          }}>❌ {error}</div>
        )}
        {success && (
          <div style={{
            background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.35)',
            padding: '0.6rem 0.75rem', borderRadius: '5px', color: '#00ff41',
            fontSize: '0.77rem', fontFamily: 'var(--font-mono)', lineHeight: 1.5
          }}>✓ {success}</div>
        )}

        {/* ── Google Sign-In Button ── */}
        {showGoogleBtn && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
            <div ref={googleBtnRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
            {!googleReady && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Loading Google Sign-In...
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', width: '100%', margin: '0.2rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(var(--accent-rgb), 0.15)' }} />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(var(--accent-rgb), 0.15)' }} />
            </div>
          </div>
        )}

        {/* ── Registration Success ── */}
        {mode === 'reg-success' && (
          <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🎉</div>
            <p style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.7 }}>
              Your account has been created successfully.<br />Please sign in to continue.
            </p>
            <button className="action-btn" onClick={() => switchMode('login')}
              style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', marginTop: '1.2rem', fontWeight: '800' }}>
              SIGN IN NOW →
            </button>
          </div>
        )}

        {/* ── Form ── */}
        {mode !== 'reg-success' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

            {mode === 'register' && (
              <div style={fieldStyle}>
                <label style={labelStyle}>USERNAME</label>
                <input type="text" required value={username}
                  onChange={e => setUsername(e.target.value)} style={inputStyle}
                  placeholder="Choose a unique username" />
              </div>
            )}

            {['login', 'register', 'forgot'].includes(mode) && (
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {mode === 'register' ? 'EMAIL ADDRESS' : 'EMAIL ADDRESS OR USERNAME'}
                </label>
                <input type={mode === 'register' ? 'email' : 'text'} required
                  value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
                  placeholder={mode === 'register' ? 'your@email.com' : 'Email or username'} />
              </div>
            )}

            {['login', 'register'].includes(mode) && (
              <div style={fieldStyle}>
                <label style={labelStyle}>PASSWORD</label>
                <input type="password" required value={password}
                  onChange={e => setPassword(e.target.value)} style={inputStyle}
                  placeholder="••••••••" />
              </div>
            )}

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: '-0.2rem' }}>
                <button type="button" onClick={() => switchMode('forgot')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.7rem', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: 0 }}>
                  Forgot Password?
                </button>
              </div>
            )}

            {['reg-otp', 'otp'].includes(mode) && (
              <div style={fieldStyle}>
                <label style={labelStyle}>4-DIGIT VERIFICATION CODE</label>
                <input type="text" required maxLength={4}
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="0 0 0 0"
                  style={{ ...inputStyle, textAlign: 'center', fontSize: '1.8rem', letterSpacing: '14px', fontWeight: '900', padding: '0.8rem' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                  <p style={{ fontSize: '0.67rem', color: 'var(--text-secondary)', margin: 0, fontFamily: 'var(--font-mono)' }}>
                    ⏱ Valid 10 minutes.
                  </p>
                  <button
                    type="button"
                    disabled={resendTimer > 0 || loading}
                    onClick={handleResendOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendTimer > 0 ? 'var(--text-secondary)' : 'var(--accent-color)',
                      cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      textDecoration: resendTimer > 0 ? 'none' : 'underline',
                      padding: 0
                    }}
                  >
                    {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}

            {mode === 'reset' && (
              <>
                <div style={fieldStyle}>
                  <label style={labelStyle}>NEW PASSWORD</label>
                  <input type="password" required value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} style={inputStyle} placeholder="Min. 8 characters" />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>CONFIRM NEW PASSWORD</label>
                  <input type="password" required value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="Repeat new password" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="action-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '0.72rem', marginTop: '0.1rem', fontWeight: '800', letterSpacing: '1px' }}>
              {loading ? '⏳ PROCESSING...' : (btnLabels[mode] || 'SUBMIT')}
            </button>
          </form>
        )}

        {/* ── Footer Links ── */}
        <div style={{ textAlign: 'center', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {mode === 'login' && (
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>New to MainframeHub? </span>
              <button onClick={() => switchMode('register')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-color)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '700', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                Create Account
              </button>
            </div>
          )}
          {mode === 'register' && (
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
              <button onClick={() => switchMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-color)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '700', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                Sign In
              </button>
            </div>
          )}
          {['reg-otp', 'forgot', 'otp', 'reset'].includes(mode) && (
            <button onClick={() => switchMode('login')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
