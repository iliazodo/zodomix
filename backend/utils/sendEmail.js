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
    html: `<a href="${link}">Click to verify</a>`,
  });
};

export default sendVerificationEmail;
