import nodemailer from "nodemailer";

export const sendToEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { 
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"CareerVidya " <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  };

  await transporter.sendMail(mailOptions);
};
