import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

export async function sendPasswordResetCodeEmail(email: string, code: string) {
  const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!smtpFrom) {
    throw new Error("SMTP_FROM or SMTP_USER must be configured.");
  }

  await getTransporter().sendMail({
    from: smtpFrom,
    to: email,
    subject: "Your password reset code",
    text: `Use this code to reset your password: ${code}\n\nThis code expires in 15 minutes.`,
    html: `
      <p>Use this code to reset your password:</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p>
      <p>This code expires in 15 minutes.</p>
    `,
  });
}
