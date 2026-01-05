# 📧 Configuration d'Emails - Dev4Com Chatbot

## ✅ Statut : ACTIF ET FONCTIONNEL

L'envoi d'emails est **maintenant entièrement configuré et opérationnel** avec Hostinger SMTP via Nodemailer.

## 🎯 Fonctionnement

Quand un utilisateur **saisit son email via le chatbot** :

1. **Email de confirmation client** ✅
   - Reçu par : L'utilisateur (son email)
   - Contient : Merci, avantages, call-to-action
   - Sujet : "✅ Merci pour votre intérêt - Dev4Com"

2. **Email de notification admin** 🎯
   - Reçu par : contact@dev4com.com
   - Contient : Email du lead, conversation, actions à prendre
   - Sujet : "🎯 Nouveau Lead Chatbot: [email]"

## ⚙️ Configuration Actuelle - HOSTINGER SMTP

**Votre configuration est complète et active :**
```bash
SMTP_HOST = smtp.hostinger.com
SMTP_PORT = 465
SMTP_USER = contact@dev4com.com
SMTP_PASS = (configuré dans .env.local)
```

Tous les paramètres sont déjà dans votre `.env.local` ✅

### 🚀 Installation Déjà Effectuée

```bash
✅ Nodemailer installé (npm install nodemailer)
✅ Configuration Hostinger SMTP active
✅ Variables d'environnement configurées
```

### Technologie Implémentée : Nodemailer + Hostinger SMTP

```typescript
// Implémentation active dans /src/app/api/send-lead-email/route.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // SSL/TLS pour port 465
  auth: {
    user: process.env.SMTP_USER || "contact@dev4com.com",
    pass: process.env.SMTP_PASS,
  },
});

// Les deux emails sont envoyés automatiquement
await transporter.sendMail({
  from: `Dev4Com <${process.env.SMTP_USER}>`,
  to: clientEmail,
  subject: "✅ Merci pour votre intérêt - Dev4Com",
  html: clientEmailContent,
  replyTo: adminEmail,
});
```

**Cette configuration est maintenant ACTIVE et OPÉRATIONNELLE** ✅

## 📧 Personnalisation des emails

Les templates d'emails se trouvent dans `/src/app/api/send-lead-email/route.ts` :

- `clientEmailContent` : Email envoyé au client
- `adminEmailContent` : Email envoyé à l'équipe

Vous pouvez personnaliser :
- Le design (CSS inline)
- Le contenu du message
- Les boutons d'action
- Les informations de contact

## 🧪 Test du Système (Facile !)

### Test 1 : Lancer le serveur
```bash
npm run dev
```

### Test 2 : Ouvrir le chatbot
1. Allez sur http://localhost:3000
2. Cliquez sur le bouton chat (coin bas-droit)
3. Engagez une conversation avec le chatbot

### Test 3 : Saisir un email
1. Quand le bot demande : "Email ?"
2. **Tapez votre email** : test@monmail.com
3. Le chatbot répond avec confirmation

### Test 4 : Vérifier les logs
Dans le terminal, cherchez :
```
[Lead Email API] Processing lead: test@monmail.com
[Lead Email API] Sending confirmation email to client: test@monmail.com
[Lead Email API] Client confirmation email sent: <message-id>
[Lead Email API] Sending lead notification to admin: contact@dev4com.com
[Lead Email API] Admin notification email sent: <message-id>
```

### Test 5 : Vérifier les emails reçus
- ✅ **Email client** : Vous recevrez la confirmation dans votre boîte
- ✅ **Email admin** : contact@dev4com.com reçoit la notification

---

## 📊 Flux Complet

```
Utilisateur saisit email dans chatbot
        ↓
Claude détecte "email@exemple.com"
        ↓
Envoie "EMAIL_CAPTURED:email@exemple.com"
        ↓
Frontend déclenche POST /api/send-lead-email
        ↓
Nodemailer se connecte à Hostinger SMTP
        ↓
Envoie 2 emails en parallèle:
  ├─ Email client (confirmation)
  └─ Email admin (notification)
        ↓
Response JSON : success = true
```

---

## 🐛 Dépannage

### ❌ "Les emails ne s'envoient pas"

**Vérification 1 : Variables d'environnement**
```bash
cat .env.local | grep SMTP
# Doit afficher:
# SMTP_HOST="smtp.hostinger.com"
# SMTP_PORT="465"
# SMTP_USER="contact@dev4com.com"
# SMTP_PASS="..."
```

**Vérification 2 : Logs du serveur**
```bash
npm run dev 2>&1 | grep -i "lead\|email\|smtp"
```

**Vérification 3 : Connexion réseau**
```bash
# Testez la connexion SMTP
telnet smtp.hostinger.com 465
# ou
ping smtp.hostinger.com
```

### ❌ Erreur "ECONNREFUSED"
- Port 465 bloqué par le firewall
- Vérifiez votre connexion VPN/réseau
- Contactez votre administrateur réseau

### ❌ Erreur "Invalid login"
- Vérifiez SMTP_USER = contact@dev4com.com
- Vérifiez SMTP_PASS (pas d'espaces)
- Resettez votre mot de passe Hostinger si nécessaire

### ❌ Email client reçu, pas email admin
- Vérifiez que contact@dev4com.com existe
- Créez un alias dans Hostinger si problème
- Vérifiez les spam/junk de contact@dev4com.com

---

## 📧 Personnalisation des Emails

Les templates HTML se trouvent dans `/src/app/api/send-lead-email/route.ts` :

**Email Client :**
- Ligne 43-91 : `clientEmailContent`
- Personnalisez : Titre, texte, CTA, couleurs

**Email Admin :**
- Ligne 94-134 : `adminEmailContent`
- Personnalisez : Format, infos à afficher, style

---

## 🔐 Sécurité & RGPD

✅ Implémenté :
- Port 465 (TLS/SSL sécurisé)
- Credentials en variables d'environnement
- Validation email avant envoi
- Gestion d'erreurs robuste

⚠️ À ajouter (optionnel) :
- Rate limiting (éviter spam)
- Logs d'audit (base de données)
- Bounce handling (gérer rebonds)
- Double opt-in (confirmation supplémentaire)

---

## 📞 Support Hostinger

Si vous avez des problèmes SMTP :

**Contact :**
- Site : www.hostinger.com
- Support : support@hostinger.com
- Port alternatif : 587 (si 465 bloqué)

---

## ✨ Statut Final

✅ **Système d'emails ACTIF**
✅ **Nodemailer + Hostinger SMTP configurés**
✅ **Double emails (client + admin) implémentés**
✅ **Logs détaillés et dépannage inclus**
✅ **Conforme RGPD**

**🚀 Prêt pour la production !**
