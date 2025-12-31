# Guide de Test du Chatbot Lead Generation

Le chatbot a été simplifié pour une seule mission : **générer des leads avec email**.

## 🎯 Parcours utilisateur simplifié

### Étape 1 - Message de bienvenue
**Bot:** "Bonjour ! 👋 Je peux vous aider avec un site web, e-commerce, SEO ou design. Quel est votre projet ?"

**Suggestions affichées:**
- Créer un site web
- Créer une boutique en ligne
- Améliorer mon SEO
- Design et identité visuelle

### Étape 2 - Réponse au besoin
**Visiteur:** "Je veux un site web"

**Bot:** "Parfait ! Nous créons des sites modernes avec maquette gratuite et 1 an de maintenance offert. Je vous envoie notre portfolio et un devis par email ?"

**Suggestions:**
- Oui, envoyez-moi les infos
- Voir des exemples
- Quel est le prix ?

### Étape 3 - Demande d'email
**Visiteur:** "Oui, envoyez-moi les infos"

**Bot:** "Super ! Quelle est votre adresse email pour recevoir tout ça ?"

**Suggestions:**
- [Taper mon email]
- Discuter d'abord
- Poser une question

### Étape 4 - Capture de l'email
**Visiteur:** "contact@exemple.fr"

**Bot:** "Merci ! Vous recevrez un email à contact@exemple.fr dans 5 minutes. Notre équipe vous contactera sous 24h !"

**Actions automatiques:**
- ✉️ Email de confirmation envoyé au client
- ✉️ Notification envoyée à l'équipe DEV4COM
- 📊 Lead enregistré dans les logs

**Suggestions:**
- Poser une autre question
- Voir vos projets
- En savoir plus sur vos services

## 🧪 Tests à effectuer

### Test 1: Parcours complet standard
1. Ouvrir le chatbot
2. Cliquer sur "Créer un site web"
3. Accepter de recevoir les infos par email
4. Saisir un email de test
5. Vérifier la réception des 2 emails (client + admin)

### Test 2: Email direct
1. Ouvrir le chatbot
2. Écrire directement "contact@test.fr"
3. Le bot doit détecter l'email et confirmer immédiatement

### Test 3: Questions hors sujet
1. Demander quelque chose hors digital
2. Le bot doit ramener vers les services (site web, e-commerce, SEO, design)

### Test 4: Parcours E-commerce
1. Cliquer sur "Créer une boutique en ligne"
2. Suivre le parcours jusqu'à l'email
3. Vérifier que le bot mentionne bien e-commerce dans ses réponses

### Test 5: Multiples questions
1. Poser plusieurs questions avant de donner l'email
2. Le bot doit toujours orienter vers la demande d'email après 2-3 échanges

## ⚠️ Problèmes possibles

### Le bot répète "Je n'ai pas compris"
**Cause:** API Gemini ne répond pas correctement
**Solution:**
- Vérifier que GEMINI_API_KEY est bien configurée dans .env.local
- Vérifier les logs dans la console (F12)
- Le bot devrait maintenant proposer automatiquement les services

### Les suggestions ne s'affichent pas
**Cause:** Format de réponse incorrect
**Solution:** Le bot a été configuré pour TOUJOURS retourner des suggestions par défaut

### L'email n'est pas capturé
**Cause:** Tag EMAIL_CAPTURED: manquant
**Solution:** Vérifier dans les logs si le tag est bien présent dans la réponse de Gemini

### Les emails ne sont pas envoyés
**Cause:** Service d'email non configuré
**Solution:** Voir EMAIL_SETUP.md pour configurer Resend, SendGrid ou Nodemailer

## 📊 Métriques à suivre

- **Taux d'ouverture du chat:** % de visiteurs qui ouvrent le chatbot
- **Taux de conversion:** % de conversations qui aboutissent à un email
- **Temps moyen de conversion:** Nombre de messages avant l'email
- **Qualité des leads:** Pertinence des demandes reçues

## 🔧 Debug

Pour voir les logs détaillés :
1. Ouvrir la console (F12)
2. Onglet Console
3. Chercher les messages "[Chat API]" et "[Gemini]"

Messages importants :
- `[Chat API] Email captured:` → Email détecté
- `[Gemini] Empty response received` → Problème avec l'API
- `[Lead Email API] Emails would be sent to:` → Simulation d'envoi d'email

## ✅ Checklist avant mise en production

- [ ] API Gemini configurée et testée
- [ ] Service d'email configuré (Resend/SendGrid/Nodemailer)
- [ ] Adresse email admin correcte dans le code
- [ ] Test du parcours complet effectué
- [ ] Emails de confirmation et notification fonctionnels
- [ ] Design du chatbot cohérent avec le site
- [ ] Messages d'erreur personnalisés
- [ ] Respect du RGPD (mention de collecte d'email)
