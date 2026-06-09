const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const auth = require('../middleware/auth');
const { sendOtpEmail, sendRegistrationOtpEmail, sendPasswordResetConfirmEmail, testSmtpConnection, isSmtpConfigured } = require('../utils/mailer');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'mainframe_secret_token_12345';

// Helper: is this user the designated admin?
const isAdminUser = (username, email) => {
  return (
    username === 'Dineshsingla08' ||
    (email && email.toLowerCase() === 'dineshsingla08@gmail.com') ||
    username === 'admin'
  );
};

// In-memory store for password reset OTPs: key = email.toLowerCase()
const otpStore = new Map();

// In-memory store for pending registrations (awaiting email OTP verification)
// key = email.toLowerCase()
const pendingRegistrations = new Map();

// ============================================================
// @route   POST api/auth/send-registration-otp
// @desc    Step 1 of registration: send OTP to email for verification
// ============================================================
router.post('/send-registration-otp', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
      if (err) return res.status(500).json({ message: 'Database query error.' });
      if (row) return res.status(400).json({ message: 'User already exists with this email or username.' });

      // Generate 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      // Hash password in advance
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Store pending registration (10 min expiry)
      const key = email.toLowerCase();
      pendingRegistrations.set(key, {
        username,
        email,
        hashedPassword,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000
      });

      // Send OTP email
      try {
        await sendRegistrationOtpEmail(email, username, otp);
      } catch (emailErr) {
        console.error('[EMAIL ERROR]', emailErr.message);
        // Still proceed - OTP is stored, user can get it from console in dev mode
      }

      res.json({
        message: `Verification OTP sent to ${email}. Please check your inbox.`,
        emailSent: true
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ============================================================
// @route   POST api/auth/verify-registration-otp
// @desc    Step 2 of registration: verify OTP and create account
// ============================================================
router.post('/verify-registration-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  const key = email.toLowerCase();
  const pending = pendingRegistrations.get(key);

  if (!pending) {
    return res.status(400).json({ message: 'No pending registration found. Please start the registration process again.' });
  }

  if (pending.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  }

  if (pending.expiresAt < Date.now()) {
    pendingRegistrations.delete(key);
    return res.status(400).json({ message: 'OTP has expired. Please register again.' });
  }

  // OTP verified — create the user account
  const { username, hashedPassword } = pending;
  const role = isAdminUser(username, email) ? 'admin' : 'user';

  db.run(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error creating user.' });

      const userId = this.lastID;
      pendingRegistrations.delete(key);

      // Initialize progress record
      db.run('INSERT INTO user_progress (user_id) VALUES (?)', [userId], (err) => {
        if (err) console.error('Error initializing progress record:', err.message);
      });

      res.json({
        message: `Account created successfully! Welcome @${username}. Please sign in to continue.`,
        registered: true
      });
    }
  );
});

// ============================================================
// @route   POST api/auth/login
// @desc    Authenticate user & get token (accepts email or username)
// ============================================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, email], async (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

      const payload = { user: { id: user.id, username: user.username, role: user.role } };
      jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ============================================================
// @route   GET api/auth/me
// @desc    Get current user details
// ============================================================
router.get('/me', auth, (req, res) => {
  db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  });
});

// ============================================================
// @route   PUT api/auth/change-password
// @desc    Update user password (requires current password)
// ============================================================
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    db.get('SELECT password FROM users WHERE id = ?', [req.user.id], async (err, row) => {
      if (err || !row) return res.status(404).json({ message: 'User not found.' });

      const isMatch = await bcrypt.compare(currentPassword, row.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id], (err) => {
        if (err) return res.status(500).json({ message: 'Error updating password.' });
        res.json({ message: 'Password updated successfully.' });
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ============================================================
// @route   POST api/auth/forgot-password
// @desc    Request password reset — sends OTP to registered email
// ============================================================
router.post('/forgot-password', (req, res) => {
  const { emailOrUsername } = req.body;

  if (!emailOrUsername) {
    return res.status(400).json({ message: 'Please enter your email or username.' });
  }

  db.get('SELECT username, email FROM users WHERE email = ? OR username = ?', [emailOrUsername, emailOrUsername], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database query error.' });
    if (!user) return res.status(404).json({ message: 'No account found with that email or username.' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const key = user.email.toLowerCase();

    otpStore.set(key, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      username: user.username,
      email: user.email
    });

    try {
      await sendOtpEmail(user.email, user.username, otp);
    } catch (emailErr) {
      console.error('[EMAIL ERROR]', emailErr.message);
    }

    res.json({
      message: `OTP sent to ${user.email}. Please check your inbox.`,
      emailSent: true
    });
  });
});

// ============================================================
// @route   POST api/auth/verify-otp
// @desc    Verify password reset OTP
// ============================================================
router.post('/verify-otp', (req, res) => {
  const { emailOrUsername, otp } = req.body;

  if (!emailOrUsername || !otp) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  db.get('SELECT email FROM users WHERE email = ? OR username = ?', [emailOrUsername, emailOrUsername], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database query error.' });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const key = user.email.toLowerCase();
    const record = otpStore.get(key);

    if (!record) {
      return res.status(400).json({ message: 'No active OTP request found. Please request a new one.' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code.' });
    }
    if (record.expiresAt < Date.now()) {
      otpStore.delete(key);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    res.json({ message: 'OTP verified successfully.' });
  });
});

// ============================================================
// @route   POST api/auth/reset-password
// @desc    Reset password after OTP verification
// ============================================================
router.post('/reset-password', async (req, res) => {
  const { emailOrUsername, otp, newPassword } = req.body;

  if (!emailOrUsername || !otp || !newPassword) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    db.get('SELECT id, username, email FROM users WHERE email = ? OR username = ?', [emailOrUsername, emailOrUsername], async (err, user) => {
      if (err) return res.status(500).json({ message: 'Database query error.' });
      if (!user) return res.status(404).json({ message: 'User not found.' });

      const key = user.email.toLowerCase();
      const record = otpStore.get(key);

      if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP. Please start over.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], async (err) => {
        if (err) return res.status(500).json({ message: 'Error resetting password.' });

        otpStore.delete(key);

        try {
          await sendPasswordResetConfirmEmail(user.email, user.username);
        } catch (emailErr) {
          console.error('[EMAIL ERROR]', emailErr.message);
        }

        res.json({ message: 'Password reset successfully! You can now sign in with your new password.' });
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ============================================================
// @route   GET api/auth/users
// @desc    Get all users (Admin only — Dineshsingla08 exclusive)
// ============================================================
router.get('/users', auth, (req, res) => {
  db.get('SELECT role, username, email FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (!user || !isAdminUser(user.username, user.email)) {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }

    db.all(`
      SELECT u.id, u.username, u.email, u.role, u.created_at,
             p.score, p.mastered, p.needs_review, p.starred
      FROM users u
      LEFT JOIN user_progress p ON u.id = p.user_id
      ORDER BY u.created_at DESC
    `, [], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Database error fetching users.' });
      res.json(rows);
    });
  });
});

// ============================================================
// @route   DELETE api/auth/users/:id
// @desc    Delete a user (Admin only)
// ============================================================
router.delete('/users/:id', auth, (req, res) => {
  db.get('SELECT role, username, email FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (!user || !isAdminUser(user.username, user.email)) {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }

    const targetId = req.params.id;
    if (parseInt(targetId) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    db.run('DELETE FROM users WHERE id = ?', [targetId], (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting user.' });
      res.json({ message: 'User deleted successfully.' });
    });
  });
});

// ============================================================
// @route   POST api/auth/google
// @desc    Sign in or register via Google OAuth
// ============================================================
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'No Google credential token provided.' });
  }

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your_google_client_id_here.apps.googleusercontent.com') {
    return res.status(503).json({ message: 'Google Sign-In is not configured on this server yet. Please set GOOGLE_CLIENT_ID in .env.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: 'No email found in Google account.' });
    }

    // Check if user already exists by email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error.' });

      if (user) {
        // Existing user — log them in
        const role = user.role;
        const tokenPayload = { user: { id: user.id, username: user.username, role } };
        jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user.id, username: user.username, email: user.email, role } });
        });
      } else {
        // New user — create account from Google profile
        const username = name.replace(/\s+/g, '') + '_' + googleId.slice(-4);
        const role = isAdminUser(username, email) ? 'admin' : 'user';
        // No password needed for Google OAuth users (set a random hash)
        const randomPass = await bcrypt.hash(Math.random().toString(36), 10);

        db.run(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          [username, email, randomPass, role],
          function (insertErr) {
            if (insertErr) return res.status(500).json({ message: 'Error creating account.' });
            const userId = this.lastID;

            db.run('INSERT INTO user_progress (user_id) VALUES (?)', [userId], () => {});

            const tokenPayload = { user: { id: userId, username, role } };
            jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
              if (err) throw err;
              res.json({ token, user: { id: userId, username, email, role }, isNewUser: true });
            });
          }
        );
      }
    });
  } catch (err) {
    console.error('[Google Auth Error]', err.message);
    res.status(401).json({ message: 'Invalid Google token. Please try again.' });
  }
});

// ============================================================
// @route   GET api/auth/smtp-status
// @desc    Test SMTP configuration (dev/admin helper)
// ============================================================
router.get('/smtp-status', async (req, res) => {
  const configured = isSmtpConfigured();
  if (!configured) {
    return res.json({
      configured: false,
      message: 'SMTP not configured. Set SMTP_PASS (16-char Gmail App Password) in server/.env'
    });
  }
  const result = await testSmtpConnection();
  res.json({
    configured: true,
    smtpUser: process.env.SMTP_USER,
    ...result
  });
});

module.exports = router;
