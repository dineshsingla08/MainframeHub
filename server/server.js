const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db/db');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const forumRoutes = require('./routes/forum');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/forum', forumRoutes);

// Simple healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'HEALTHY', dbPath: path.resolve(__dirname, 'db/mainframehub.db'), time: new Date() });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`⚡ MainframeHub Backend Server running on port ${PORT}`);
  console.log(`⚙️  Access APIs via http://localhost:${PORT}/api`);
  console.log(`=============================================`);
});
