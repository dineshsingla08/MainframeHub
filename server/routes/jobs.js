const express = require('express');
const router = express.Router();
const db = require('../db/db');

// @route   GET api/jobs
// @desc    Retrieve all jobs with optional filters
router.get('/', (req, res) => {
  const { search, type, experience } = req.query;
  
  let query = 'SELECT * FROM jobs WHERE 1=1';
  let params = [];

  if (search) {
    query += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ? OR location LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  if (type && type !== 'ALL') {
    query += ' AND type = ?';
    params.push(type);
  }

  if (experience && experience !== 'ALL') {
    query += ' AND experience = ?';
    params.push(experience);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching jobs:', err.message);
      return res.status(500).json({ message: 'Database error fetching jobs.' });
    }
    
    // Parse requirements JSON
    const jobs = (rows || []).map(row => {
      let requirements = [];
      try {
        if (row.requirements) requirements = JSON.parse(row.requirements);
      } catch (e) {
        requirements = [row.requirements];
      }
      return { ...row, requirements };
    });
    
    res.json(jobs);
  });
});

// @route   GET api/jobs/:id
// @desc    Get specific job details
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching job detail:', err.message);
      return res.status(500).json({ message: 'Database error fetching job.' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    
    let requirements = [];
    try {
      if (row.requirements) requirements = JSON.parse(row.requirements);
    } catch (e) {
      requirements = [row.requirements];
    }
    
    res.json({ ...row, requirements });
  });
});

module.exports = router;
