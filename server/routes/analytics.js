const express = require('express');
const router = express.Router();
const db = require('../db/db');
const auth = require('../middleware/auth');

// @route   POST api/analytics/hit
// @desc    Record a site visit
// @access  Public
router.post('/hit', (req, res) => {
  const { username } = req.body;
  let ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  // Normalize IPv6 localhost
  if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
    ipAddress = '127.0.0.1';
  }
  const userAgent = req.headers['user-agent'] || '';

  db.run(
    'INSERT INTO site_visits (ip_address, user_agent, username) VALUES (?, ?, ?)',
    [ipAddress, userAgent, username || 'Guest'],
    function (err) {
      if (err) {
        console.error('Failed to register visit:', err.message);
        return res.status(500).json({ message: 'Failed to log visit' });
      }
      res.json({ success: true, visitId: this.lastID });
    }
  );
});

// @route   GET api/analytics/stats
// @desc    Retrieve visitor statistics and logs (Admin only)
// @access  Private (Admin)
router.get('/stats', auth, (req, res) => {
  const userId = req.user.id;
  db.get('SELECT role, username, email FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    const isAdmin = user && (
      user.role === 'admin' ||
      user.username === 'Dineshsingla08' ||
      (user.email && user.email.toLowerCase() === 'dineshsingla08@gmail.com') ||
      user.username === 'admin'
    );

    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }

    const stats = {
      lifetime: { total: 0, unique: 0 },
      monthly: { total: 0, unique: 0 },
      daily: { total: 0, unique: 0 },
      recent: []
    };

    // Query daily, monthly, lifetime statistics in one roundtrip
    db.get(`
      SELECT 
        (SELECT COUNT(*) FROM site_visits) as lifetime_total,
        (SELECT COUNT(DISTINCT ip_address) FROM site_visits) as lifetime_unique,
        (SELECT COUNT(*) FROM site_visits WHERE strftime('%Y-%m', visited_at) = strftime('%Y-%m', 'now')) as monthly_total,
        (SELECT COUNT(DISTINCT ip_address) FROM site_visits WHERE strftime('%Y-%m', visited_at) = strftime('%Y-%m', 'now')) as monthly_unique,
        (SELECT COUNT(*) FROM site_visits WHERE strftime('%Y-%m-%d', visited_at) = strftime('%Y-%m-%d', 'now')) as daily_total,
        (SELECT COUNT(DISTINCT ip_address) FROM site_visits WHERE strftime('%Y-%m-%d', visited_at) = strftime('%Y-%m-%d', 'now')) as daily_unique
    `, [], (err, row) => {
      if (err) {
        console.error('Error fetching statistics:', err.message);
        return res.status(500).json({ message: 'Database error querying statistics.' });
      }

      if (row) {
        stats.lifetime.total = row.lifetime_total || 0;
        stats.lifetime.unique = row.lifetime_unique || 0;
        stats.monthly.total = row.monthly_total || 0;
        stats.monthly.unique = row.monthly_unique || 0;
        stats.daily.total = row.daily_total || 0;
        stats.daily.unique = row.daily_unique || 0;
      }

      // Fetch recent 50 visits
      db.all(`
        SELECT id, ip_address, user_agent, username, visited_at 
        FROM site_visits 
        ORDER BY visited_at DESC 
        LIMIT 50
      `, [], (err, rows) => {
        if (err) {
          console.error('Error fetching recent logs:', err.message);
          return res.status(500).json({ message: 'Database error querying recent logs.' });
        }
        stats.recent = rows || [];
        res.json(stats);
      });
    });
  });
});

module.exports = router;
