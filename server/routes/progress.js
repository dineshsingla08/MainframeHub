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

module.exports = router;
