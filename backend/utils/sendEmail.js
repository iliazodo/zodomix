import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_LOGIN,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Zodmix" <no-reply@zodomix.com>',
    to: email,
    subject: "Verify your email",
    text: `Verify your email: ${link}`,
    html: `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome to Zodmix!</h2>
      <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
      <p>
        <a href="${link}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
      </p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${link}</p>
      <p>– The Zodmix Team</p>
    </body>
  </html>
`,
  });
};

export const sendPasswordResetEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_LOGIN,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Zodomix" <no-reply@zodomix.com>',
    to: email,
    subject: "Reset your password",
    text: `Reset your password: ${link}`,
    html: `
  <html>
    <body style="font-family: Arial, sans-serif; background:#000; color:#fff; padding:32px;">
      <h2 style="color:#00FF7B;">Password Reset</h2>
      <p>You requested a password reset. Click the button below — this link expires in <strong>1 hour</strong>.</p>
      <p>
        <a href="${link}" style="padding:12px 24px; background:#00FF7B; color:#000; text-decoration:none; border-radius:999px; font-weight:bold;">
          RESET PASSWORD
        </a>
      </p>
      <p style="color:#888;">If the button doesn't work, paste this link into your browser:</p>
      <p style="color:#00F2FF;">${link}</p>
      <p style="color:#888;">If you didn't request this, ignore this email.</p>
      <p style="color:#888;">– The Zodomix Team</p>
    </body>
  </html>
`,
  });
};

export const sendTelegramMessage = async (message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = `💬${message}`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
    }),
  });
};
