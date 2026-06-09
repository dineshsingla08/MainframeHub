const express = require('express');
const router = express.Router();
const db = require('../db/db');
const auth = require('../middleware/auth');

// @route   GET api/progress
// @desc    Get current user's progress arrays & score
router.get('/', auth, (req, res) => {
  db.get('SELECT * FROM user_progress WHERE user_id = ?', [req.user.id], (err, progress) => {
    if (err) return res.status(500).json({ message: 'Database query error.' });
    
    if (!progress) {
      // Create record if it doesn't exist
      db.run('INSERT INTO user_progress (user_id) VALUES (?)', [req.user.id], function(err) {
        if (err) return res.status(500).json({ message: 'Error initializing progress record.' });
        return res.json({ mastered: [], needs_review: [], starred: [], score: 0 });
      });
    } else {
      res.json({
        mastered: JSON.parse(progress.mastered || '[]'),
        needs_review: JSON.parse(progress.needs_review || '[]'),
        starred: JSON.parse(progress.starred || '[]'),
        score: progress.score || 0
      });
    }
  });
});

// @route   POST api/progress
// @desc    Update progress lists and score
router.post('/', auth, (req, res) => {
  const { mastered, needs_review, starred, score } = req.body;

  const masteredStr = JSON.stringify(mastered || []);
  const needsReviewStr = JSON.stringify(needs_review || []);
  const starredStr = JSON.stringify(starred || []);
  const scoreVal = typeof score === 'number' ? score : 0;

  db.run(`
    INSERT INTO user_progress (user_id, mastered, needs_review, starred, score, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      mastered = excluded.mastered,
      needs_review = excluded.needs_review,
      starred = excluded.starred,
      score = excluded.score,
      updated_at = CURRENT_TIMESTAMP
  `, [req.user.id, masteredStr, needsReviewStr, starredStr, scoreVal], function(err) {
    if (err) {
      console.error('Database update error:', err.message);
      return res.status(500).json({ message: 'Database update failed.' });
    }
    res.json({ message: 'Progress synchronized successfully.' });
  });
});

// @route   GET api/progress/leaderboard
// @desc    Get top users ranked by score
router.get('/leaderboard', (req, res) => {
  db.all(`
    SELECT u.id, u.username, u.role, p.score, p.mastered, p.needs_review
    FROM users u
    LEFT JOIN user_progress p ON u.id = p.user_id
    ORDER BY COALESCE(p.score, 0) DESC, u.username ASC
    LIMIT 20
  `, [], (err, rows) => {
    if (err) {
      console.error('Leaderboard query error:', err.message);
      return res.status(500).json({ message: 'Database error fetching leaderboard.' });
    }
    
    const leaderboard = (rows || []).map(row => {
      let masteredCount = 0;
      let needsReviewCount = 0;
      try {
        if (row.mastered) masteredCount = JSON.parse(row.mastered).length;
        if (row.needs_review) needsReviewCount = JSON.parse(row.needs_review).length;
      } catch (e) {
        console.error('Error parsing progress lists:', e.message);
      }
      return {
        id: row.id,
        username: row.username,
        role: row.role,
        score: row.score || 0,
        masteredCount,
        needsReviewCount
      };
    });
    
    res.json(leaderboard);
  });
});

const mailer = require('../utils/mailer');

// @route   POST api/progress/send-exam-report
// @desc    Send detailed exam report via email
router.post('/send-exam-report', auth, async (req, res) => {
  const { category, score, total, reportDetails, userEmail } = req.body;
  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required to send report.' });
  }

  try {
    const result = await mailer.sendExamReportEmail(userEmail, req.user.username, category, score, total, reportDetails);
    res.json({ message: 'Exam report sent successfully.', ...result });
  } catch (err) {
    console.error('Error sending exam report email:', err);
    res.status(500).json({ message: 'Failed to send exam report email.' });
  }
});

module.exports = router;
