const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false }
  });
};

const isSmtpConfigured = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  // Gmail App Passwords are exactly 16 alphanumeric characters (no spaces/specials)
  return user && pass && pass !== 'your_16_char_app_password_here' && pass.length >= 16;
};

const logSimulated = (to, subject, body) => {
  console.log('\n' + '='.repeat(56));
  console.log('[EMAIL SIMULATOR - Configure SMTP_PASS in .env]');
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:    ${body}`);
  console.log('='.repeat(56) + '\n');
};

// ─── Send OTP for Password Reset ─────────────────────────────
const sendOtpEmail = async (toEmail, username, otp) => {
  if (!isSmtpConfigured()) {
    logSimulated(toEmail, 'MainframeHub - Password Reset OTP',
      `Hello @${username}. Your OTP is: ${otp} (valid 10 minutes)`);
    return { simulated: true };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"MainframeHub" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'MainframeHub — Password Reset OTP',
    html: buildOtpHtml(username, otp, 'Password Reset', 'reset your account password')
  });
  console.log(`[EMAIL SENT] OTP to ${toEmail} | MsgId: ${info.messageId}`);
  return { sent: true, messageId: info.messageId };
};

// ─── Send OTP for Registration Verification ──────────────────
const sendRegistrationOtpEmail = async (toEmail, username, otp) => {
  if (!isSmtpConfigured()) {
    logSimulated(toEmail, 'MainframeHub - Email Verification OTP',
      `Hello @${username}. Verify your email with OTP: ${otp} (valid 10 minutes)`);
    return { simulated: true };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"MainframeHub" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'MainframeHub — Email Verification OTP',
    html: buildOtpHtml(username, otp, 'Email Verification', 'verify your email and complete registration')
  });
  console.log(`[EMAIL SENT] Registration OTP to ${toEmail} | MsgId: ${info.messageId}`);
  return { sent: true, messageId: info.messageId };
};

// ─── Send Password Reset Confirmation ────────────────────────
const sendPasswordResetConfirmEmail = async (toEmail, username) => {
  if (!isSmtpConfigured()) {
    logSimulated(toEmail, 'MainframeHub - Password Reset Successful',
      `Hello @${username}. Your password has been successfully reset.`);
    return { simulated: true };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"MainframeHub" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'MainframeHub — Password Reset Successful',
    html: `
      <div style="font-family:'Courier New',monospace;background:#0d130d;color:#00ff41;padding:32px;border-radius:10px;max-width:520px;margin:auto;border:1px solid #00ff41;">
        <h2 style="color:#00ff41;border-bottom:1px solid #1a3a1a;padding-bottom:12px;font-size:20px;">◈ MainframeHub</h2>
        <p style="margin:16px 0;">Hello <strong>@${username}</strong>,</p>
        <p>✅ Your password has been <strong>successfully reset</strong>.</p>
        <p style="color:#aaa;font-size:12px;margin-top:24px;border-top:1px solid #1a3a1a;padding-top:16px;">
          If you did not make this change, contact support immediately.
        </p>
      </div>`
  });
  console.log(`[EMAIL SENT] Reset confirm to ${toEmail} | MsgId: ${info.messageId}`);
  return { sent: true, messageId: info.messageId };
};

// ─── Test SMTP connection ─────────────────────────────────────
const testSmtpConnection = async () => {
  if (!isSmtpConfigured()) {
    return { ok: false, reason: 'SMTP not configured (set SMTP_PASS in .env)' };
  }
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
};

// ─── HTML Template Builder ────────────────────────────────────
const buildOtpHtml = (username, otp, title, purpose) => `
  <div style="font-family:'Courier New',monospace;background:#0d130d;color:#00ff41;padding:32px;border-radius:10px;max-width:520px;margin:auto;border:1px solid #00ff41;">
    <h2 style="color:#00ff41;border-bottom:1px solid #1a3a1a;padding-bottom:12px;font-size:20px;">◈ MainframeHub — ${title}</h2>
    <p style="margin:16px 0;">Hello <strong>@${username}</strong>,</p>
    <p>Use the code below to ${purpose}:</p>
    <div style="background:rgba(0,255,65,0.07);border:2px solid #00ff41;padding:24px;text-align:center;border-radius:8px;margin:24px 0;">
      <span style="font-size:42px;font-weight:900;letter-spacing:14px;color:#00ff41;">${otp}</span>
    </div>
    <p style="color:#aaa;font-size:12px;">⏱ This code expires in <strong>10 minutes</strong>. Never share it with anyone.</p>
    <p style="color:#555;font-size:11px;margin-top:24px;border-top:1px solid #1a3a1a;padding-top:16px;">
      If you did not request this, please ignore this email.
    </p>
  </div>
`;

// ─── Send Exam Report Email ─────────────────────────────────────
const sendExamReportEmail = async (toEmail, username, category, score, total, reportDetails) => {
  if (!isSmtpConfigured()) {
    logSimulated(toEmail, 'MainframeHub - Exam Completion Report',
      `Hello @${username}. You scored ${score}/${total} on the ${category} exam.\n\n${reportDetails}`);
    return { simulated: true };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail({
    from: `"MainframeHub" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `MainframeHub — Exam Report: ${category} Specialist`,
    html: `
      <div style="font-family:'Courier New',monospace;background:#0d130d;color:#00ff41;padding:32px;border-radius:10px;max-width:600px;margin:auto;border:1px solid #00ff41;">
        <h2 style="color:#00ff41;border-bottom:1px solid #1a3a1a;padding-bottom:12px;font-size:20px;">◈ MainframeHub Exam Report</h2>
        <p style="margin:16px 0;">Hello <strong>@${username}</strong>,</p>
        <p>You have completed the <strong>${category} Specialist</strong> exam.</p>
        <div style="background:rgba(0,255,65,0.07);border:2px solid #00ff41;padding:20px;text-align:center;border-radius:8px;margin:24px 0;">
          <div style="font-size:16px;color:#00ff41;margin-bottom:8px;">FINAL SCORE</div>
          <span style="font-size:42px;font-weight:900;letter-spacing:4px;color:#00ff41;">${score}/${total}</span>
        </div>
        <div style="margin-top: 24px;">
          <h3 style="color:#ffaa00;font-size:16px;margin-bottom:12px;">Detailed Breakdown:</h3>
          <pre style="background:rgba(0,0,0,0.4);border:1px solid #1a3a1a;padding:16px;color:#ccc;white-space:pre-wrap;font-size:13px;line-height:1.5;">${reportDetails}</pre>
        </div>
        <p style="color:#aaa;font-size:12px;margin-top:32px;border-top:1px solid #1a3a1a;padding-top:16px;">
          Keep practicing on the MainframeHub simulator!
        </p>
      </div>`
  });
  console.log(`[EMAIL SENT] Exam Report to ${toEmail} | MsgId: ${info.messageId}`);
  return { sent: true, messageId: info.messageId };
};

module.exports = {
  sendOtpEmail,
  sendRegistrationOtpEmail,
  sendPasswordResetConfirmEmail,
  sendExamReportEmail,
  testSmtpConnection,
  isSmtpConfigured
};
