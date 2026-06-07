const express = require('express');
const router = express.Router();
const db = require('../db/db');
const auth = require('../middleware/auth');

// @route   GET api/forum/topics
// @desc    Get all forum topics
router.get('/topics', (req, res) => {
  db.all('SELECT * FROM forum_topics ORDER BY created_at DESC', [], (err, topics) => {
    if (err) return res.status(500).json({ message: 'Database query error.' });
    res.json(topics);
  });
});

// @route   POST api/forum/topics
// @desc    Create a new topic
router.post('/topics', auth, (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const cat = category || 'General';

  db.run(
    'INSERT INTO forum_topics (user_id, username, title, content, category) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, req.user.username, title, content, cat],
    function(err) {
      if (err) return res.status(500).json({ message: 'Database insertion error.' });
      
      const topicId = this.lastID;
      res.json({ id: topicId, username: req.user.username, title, content, category: cat, likes: 0, created_at: new Date() });
    }
  );
});

// @route   GET api/forum/topics/:id
// @desc    Get topic detail with replies
router.get('/topics/:id', (req, res) => {
  const topicId = req.params.id;

  db.get('SELECT * FROM forum_topics WHERE id = ?', [topicId], (err, topic) => {
    if (err) return res.status(500).json({ message: 'Database query error.' });
    if (!topic) return res.status(404).json({ message: 'Topic not found.' });

    db.all('SELECT * FROM forum_replies WHERE topic_id = ? ORDER BY created_at ASC', [topicId], (err, replies) => {
      if (err) return res.status(500).json({ message: 'Database error fetching replies.' });
      res.json({ topic, replies });
    });
  });
});

// @route   POST api/forum/topics/:id/replies
// @desc    Reply to a topic
router.post('/topics/:id/replies', auth, (req, res) => {
  const topicId = req.params.id;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Reply content is required.' });
  }

  // Check if topic exists
  db.get('SELECT id FROM forum_topics WHERE id = ?', [topicId], (err, topic) => {
    if (err || !topic) return res.status(404).json({ message: 'Topic not found.' });

    db.run(
      'INSERT INTO forum_replies (topic_id, user_id, username, content) VALUES (?, ?, ?, ?)',
      [topicId, req.user.id, req.user.username, content],
      function(err) {
        if (err) return res.status(500).json({ message: 'Database error creating reply.' });
        
        const replyId = this.lastID;
        res.json({ id: replyId, topic_id: topicId, username: req.user.username, content, created_at: new Date() });
      }
    );
  });
});

// @route   POST api/forum/topics/:id/like
// @desc    Like/Upvote a topic
router.post('/topics/:id/like', (req, res) => {
  const topicId = req.params.id;
  db.run('UPDATE forum_topics SET likes = likes + 1 WHERE id = ?', [topicId], function(err) {
    if (err) return res.status(500).json({ message: 'Database error.' });
    res.json({ success: true });
  });
});

module.exports = router;
