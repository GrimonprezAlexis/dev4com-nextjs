import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, conversationSummary } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log('[Lead Email API] Processing lead:', email);

    // Configure Nodemailer with Hostinger SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "contact@dev4com.com",
        pass: process.env.SMTP_PASS || "",
      },
    });

    // Email configuration
    const adminEmail = process.env.CONTACT_EMAIL || "contact@dev4com.com";
    const clientEmail = email;
    const fromEmail = `Dev4Com <${process.env.SMTP_USER || "contact@dev4com.com"}>`;

    // Email content for client
    const clientEmailContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .highlight { background: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Merci pour votre intérêt !</h1>
            <p>DEV4COM - Votre partenaire digital</p>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Nous avons bien reçu votre demande d'informations via notre assistant virtuel.</p>

            <div class="highlight">
              <strong>Ce que nous allons faire pour vous :</strong>
              <ul>
                <li>Notre équipe va analyser vos besoins</li>
                <li>Nous vous contacterons sous 24h pour discuter de votre projet</li>
                <li>Vous recevrez une proposition personnalisée</li>
              </ul>
            </div>

            <p><strong>Nos avantages exclusifs :</strong></p>
            <ul>
              <li>✅ Maquette gratuite avant tout engagement</li>
              <li>✅ Maintenance gratuite pendant 1 an</li>
              <li>✅ Support technique dédié</li>
              <li>✅ Formation complète incluse</li>
            </ul>

            <p>En attendant, n'hésitez pas à consulter notre portfolio et nos réalisations sur notre site web.</p>

            <div style="text-align: center;">
              <a href="https://dev4com.com/projets" class="button">Voir nos réalisations</a>
            </div>

            <p>À très bientôt,<br>
            <strong>L'équipe DEV4COM</strong></p>
          </div>
          <div class="footer">
            <p>DEV4COM - Solutions digitales sur mesure</p>
            <p>Lausanne, Suisse</p>
            <p>Email: contact@dev4com.com</p>
          </div>
        </div>
      </body>
    </html>
    `;

    // Email content for admin
    const adminEmailContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
          .lead-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎯 Nouveau Lead Capturé via Chatbot</h2>
          </div>
          <div class="content">
            <div class="lead-info">
              <p><strong>Email du lead:</strong> ${email}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            </div>

            ${conversationSummary ? `
            <div class="lead-info">
              <p><strong>Résumé de la conversation:</strong></p>
              <p>${conversationSummary}</p>
            </div>
            ` : ''}

            <p><strong>Actions à prendre:</strong></p>
            <ul>
              <li>Contacter le lead dans les 24h</li>
              <li>Envoyer une proposition personnalisée</li>
              <li>Ajouter au CRM</li>
            </ul>
          </div>
        </div>
      </body>
    </html>
    `;

    // Send confirmation email to client
    console.log('[Lead Email API] Sending confirmation email to client:', clientEmail);
    try {
      const clientResult = await transporter.sendMail({
        from: fromEmail,
        to: clientEmail,
        subject: "✅ Merci pour votre intérêt - Dev4Com",
        html: clientEmailContent,
        replyTo: adminEmail,
      });
      console.log('[Lead Email API] Client confirmation email sent:', clientResult.messageId);
    } catch (emailError: any) {
      console.error('[Lead Email API] Failed to send client email:', emailError);
      // Continue even if client email fails - still notify admin
    }

    // Send notification email to admin
    console.log('[Lead Email API] Sending lead notification to admin:', adminEmail);
    try {
      const adminResult = await transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `🎯 Nouveau Lead Chatbot: ${email}`,
        html: adminEmailContent,
        replyTo: clientEmail,
      });
      console.log('[Lead Email API] Admin notification email sent:', adminResult.messageId);
    } catch (emailError: any) {
      console.error('[Lead Email API] Failed to send admin email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Lead captured and confirmation emails sent successfully",
      email: clientEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Send Lead Email API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process lead",
        details: error?.message || "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}
