# Configuration de l'envoi d'emails pour le Chatbot

Le chatbot est maintenant configuré pour collecter les emails des visiteurs et envoyer automatiquement :
1. Un email de confirmation au client
2. Une notification à l'équipe DEV4COM avec les informations du lead

## 🎯 Fonctionnement actuel

- Le chatbot détecte automatiquement quand un visiteur saisit son email
- Une fois l'email capturé, le système :
  - Envoie un email de bienvenue au client
  - Notifie l'équipe DEV4COM avec le résumé de la conversation
  - Continue la conversation normalement

## ⚙️ Configuration requise (À FAIRE)

Pour activer l'envoi d'emails, vous devez configurer un service d'envoi. Nous recommandons **Resend** (gratuit jusqu'à 3000 emails/mois).

### Option 1 : Resend (Recommandé)

1. **Créer un compte Resend**
   - Aller sur https://resend.com
   - Créer un compte gratuit
   - Vérifier votre domaine (ou utiliser le domaine de test)

2. **Obtenir votre clé API**
   - Aller dans Settings > API Keys
   - Créer une nouvelle clé API
   - Copier la clé

3. **Installer Resend**
   ```bash
   npm install resend
   ```

4. **Ajouter la clé API dans .env.local**
   ```env
   RESEND_API_KEY=re_votre_cle_api_ici
   ```

5. **Mettre à jour le code**

   Ouvrir `/src/app/api/send-lead-email/route.ts` et décommenter les lignes Resend :

   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   // Remplacer les console.log par :
   await resend.emails.send({
     from: 'DEV4COM <noreply@dev4com.com>',
     to: clientEmail,
     subject: 'Merci pour votre intérêt - DEV4COM',
     html: clientEmailContent,
   });

   await resend.emails.send({
     from: 'Chatbot DEV4COM <chatbot@dev4com.com>',
     to: adminEmail,
     subject: `🎯 Nouveau Lead: ${email}`,
     html: adminEmailContent,
   });
   ```

### Option 2 : SendGrid

1. **Créer un compte SendGrid**
   - https://sendgrid.com
   - Plan gratuit : 100 emails/jour

2. **Installer SendGrid**
   ```bash
   npm install @sendgrid/mail
   ```

3. **Configuration**
   ```typescript
   import sgMail from '@sendgrid/mail';
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

   await sgMail.send({
     to: clientEmail,
     from: 'noreply@dev4com.com',
     subject: 'Merci pour votre intérêt - DEV4COM',
     html: clientEmailContent,
   });
   ```

### Option 3 : Nodemailer (SMTP)

```bash
npm install nodemailer
```

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

await transporter.sendMail({
  from: 'DEV4COM <noreply@dev4com.com>',
  to: clientEmail,
  subject: 'Merci pour votre intérêt - DEV4COM',
  html: clientEmailContent,
});
```

## 📧 Personnalisation des emails

Les templates d'emails se trouvent dans `/src/app/api/send-lead-email/route.ts` :

- `clientEmailContent` : Email envoyé au client
- `adminEmailContent` : Email envoyé à l'équipe

Vous pouvez personnaliser :
- Le design (CSS inline)
- Le contenu du message
- Les boutons d'action
- Les informations de contact

## 🧪 Test

Une fois configuré, testez le chatbot :

1. Ouvrir le chatbot sur votre site
2. Engager une conversation
3. Quand le bot demande l'email, saisir un email de test
4. Vérifier que vous recevez bien les 2 emails

## 📊 Suivi des leads

Les emails capturés sont envoyés à : `contact@dev4com.com`

Vous pouvez également :
- Ajouter le lead dans un CRM (Hubspot, Salesforce, etc.)
- Enregistrer dans une base de données Firebase
- Créer une feuille Google Sheets automatique

## ⚠️ Important

- Modifier `adminEmail` dans le code avec votre vraie adresse email
- Vérifier que votre domaine est bien configuré pour éviter les spams
- Respecter le RGPD : informer les utilisateurs de la collecte d'emails
