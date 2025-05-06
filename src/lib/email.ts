import nodemailer from "nodemailer";

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const adminEmailTemplate = (data: EmailData) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(to right, #2563eb, #3b82f6);
          color: white;
          padding: 30px 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          padding: 30px;
          background: white;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        .message-box {
          background: #f9fafb;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        .info-item {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-label {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .info-value {
          color: #111827;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Nouveau message de contact</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Via le formulaire DEV4COM</p>
        </div>
        <div class="content">
          <div class="info-item">
            <div class="info-label">Nom</div>
            <div class="info-value">${data.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${data.email}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Sujet</div>
            <div class="info-value">${data.subject}</div>
          </div>
          <div class="info-label">Message</div>
          <div class="message-box">
            ${data.message}
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} DEV4COM. Tous droits réservés.</p>
        </div>
      </div>
    </body>
  </html>
`;

const confirmationEmailTemplate = (data: EmailData) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(to right, #2563eb, #3b82f6);
          color: white;
          padding: 30px 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          padding: 30px;
          background: white;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        .message-summary {
          background: #f9fafb;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(to right, #2563eb, #3b82f6);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Confirmation de réception</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Merci de nous avoir contacté</p>
        </div>
        <div class="content">
          <p>Cher(e) ${data.name},</p>
          <p>Nous avons bien reçu votre message et nous vous en remercions. Notre équipe va l'examiner dans les plus brefs délais et vous répondra rapidement.</p>
          
          <h3 style="color: #4b5563; margin-top: 30px;">Récapitulatif de votre message :</h3>
          <div class="message-summary">
            <p><strong>Sujet :</strong> ${data.subject}</p>
            <p><strong>Message :</strong></p>
            <p>${data.message}</p>
          </div>

          <p>Si vous avez des questions supplémentaires, n'hésitez pas à nous contacter.</p>
          
          <div style="text-align: center;">
            <a href="https://dev4com.com" class="button">Visiter notre site</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} DEV4COM. Tous droits réservés.</p>
          <p>Cet email est une confirmation automatique, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
  </html>
`;

export const sendEmail = async (data: EmailData) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send email to admin
  const adminMailOptions = {
    from: `Confirmation de réception - DEV4COM <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `Nouveau message de ${data.name}: ${data.subject}`,
    html: adminEmailTemplate(data),
    replyTo: data.email,
  };

  // Send confirmation email to sender
  const confirmationMailOptions = {
    from: process.env.SMTP_USER,
    to: data.email,
    subject: `Confirmation de réception - DEV4COM`,
    html: confirmationEmailTemplate(data),
  };

  try {
    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(confirmationMailOptions),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
