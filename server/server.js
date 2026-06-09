const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db/db');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const forumRoutes = require('./routes/forum');
const jobsRoutes = require('./routes/jobs');
const { testSmtpConnection, isSmtpConfigured } = require('./utils/mailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/jobs', jobsRoutes);

// Simple healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'HEALTHY', dbPath: path.resolve(__dirname, 'db/mainframehub.db'), time: new Date() });
});

// ─── Port configuration ───────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`=============================================`);
  console.log(`⚡ MainframeHub Backend Server running on port ${PORT}`);
  console.log(`⚙️  Access APIs via http://localhost:${PORT}/api`);
  console.log(`=============================================`);

  // ── SMTP Startup Check ──────────────────────────────────────
  if (!isSmtpConfigured()) {
    console.log(`\n⚠️  SMTP NOT CONFIGURED`);
    console.log(`   Email OTPs will only appear in this console.`);
    console.log(`   → Set SMTP_PASS in server/.env to enable real email delivery.`);
    console.log(`   → Visit http://localhost:${PORT}/api/auth/smtp-status to check.\n`);
  } else {
    console.log(`\n📧 Testing SMTP connection...`);
    const result = await testSmtpConnection();
    if (result.ok) {
      console.log(`✅ SMTP connected successfully! (${process.env.SMTP_USER})`);
      console.log(`   Email OTPs will be delivered to real inboxes.\n`);
    } else {
      console.log(`❌ SMTP connection failed: ${result.reason}`);
      console.log(`   → Check SMTP_PASS in server/.env (needs a 16-char Gmail App Password)`);
      console.log(`   → Visit http://localhost:${PORT}/api/auth/smtp-status for details.\n`);
    }
  }

  // ── Google OAuth Status ─────────────────────────────────────
  const gId = process.env.GOOGLE_CLIENT_ID || '';
  if (!gId || gId === 'your_google_client_id_here.apps.googleusercontent.com') {
    console.log(`ℹ️  Google Sign-In: NOT CONFIGURED (GOOGLE_CLIENT_ID not set in .env)`);
  } else {
    console.log(`✅ Google Sign-In: Configured (${gId.slice(0, 20)}...)`);
  }
});
