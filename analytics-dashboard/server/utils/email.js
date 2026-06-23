const nodemailer = require('nodemailer');

// Gmail transporter — uses an App Password, not your real Gmail password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Sends the password reset email with a link containing the token
const sendResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from:    `"Analytics Dashboard" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: 'Reset your password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Reset your password</h2>
        <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.</p>
        <a href="${resetUrl}"
           style="display:inline-block; padding:10px 20px; background:#4F46E5; color:#fff; text-decoration:none; border-radius:8px; margin-top:12px;">
          Reset Password
        </a>
        <p style="margin-top:20px; font-size:13px; color:#888;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `
  });
};

module.exports = { sendResetEmail };