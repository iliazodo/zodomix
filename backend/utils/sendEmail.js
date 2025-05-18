import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  await transporter.sendMail({
    from: '"Zodmix" <no-reply@zodomix.com>',
    to: email,
    subject: "Verify your email",
    text: `Verify your email: ${link}`,
    html: (
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Zodmix!</h2>
          <p>
            Thank you for signing up. Please verify your email address by
            clicking the button below:
          </p>
          <p>
            <a
              href="${link}"
              style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;"
            >
              Verify Email
            </a>
          </p>
          <p>
            If the button doesn't work, copy and paste this link into your
            browser:
          </p>
          <p>${link}</p>
          <p>– The Zodmix Team</p>
        </body>
      </html>
    ),
  });
};

export default sendVerificationEmail;
