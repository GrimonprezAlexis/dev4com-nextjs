# 🚀 Setup Guide - Assistant IA Dev4COM avec Anthropic Claude

## ⚠️ SÉCURITÉ IMPORTANTE

Avant de continuer, **vérifiez que `.env.local` n'a jamais été commitée** :

```bash
# Vérifier l'historique git
git log --all -S "ANTHROPIC_API_KEY" --source

# Si trouvé, regénérez TOUTES vos clés API !
```

Le fichier `.env.local` est protégé par `.gitignore` mais contient actuellement des secrets. **Marquez ce fichier comme secret :**

```bash
# Marquer comme secret dans git
git update-index --skip-worktree .env.local

# Pour annuler plus tard
git update-index --no-skip-worktree .env.local
```

---

## ✅ Installation en 5 étapes

### Étape 1️⃣ : Obtenir une clé API Anthropic

1. Allez sur : https://console.anthropic.com/
2. Créez un compte ou connectez-vous
3. Générez une clé API
4. Copiez-la (format : `sk-ant-...`)

### Étape 2️⃣ : Ajouter la clé à `.env.local`

```bash
# Ouvrez .env.local
nano .env.local

# Cherchez la ligne ANTHROPIC_API_KEY et remplacez :
# DE :
ANTHROPIC_API_KEY="your-anthropic-api-key-here"

# À :
ANTHROPIC_API_KEY="sk-ant-votre-vraie-clé-ici"

# Sauvegardez (Ctrl+O, Entrée, Ctrl+X)
```

### Étape 3️⃣ : Installer les dépendances

```bash
cd /Users/alex/DEV4ECOM/Tools/dev4com-nextjs

# Installer les dépendances (inclut @anthropic-ai/sdk)
npm install

# Vérifier que l'installation réussit
npm ls @anthropic-ai/sdk
```

### Étape 4️⃣ : Lancer le serveur

```bash
npm run dev

# Vous verrez :
# ▲ Next.js 14.2.35
# - Local:        http://localhost:3000
```

### Étape 5️⃣ : Tester le chatbot

1. Ouvrez http://localhost:3000
2. Cliquez sur le bouton chat en bas à droite
3. Tapez un message : "Bonjour, je veux créer un site web"
4. Claude devrait répondre instantanément !

---

## 📋 Configuration des variables d'environnement

### Variables REQUISES pour Anthropic

```bash
# 🔴 OBLIGATOIRE - Sans cette clé, le chatbot ne marche pas
ANTHROPIC_API_KEY=sk-ant-xxx...
```

### Variables OPTIONNELLES (fallback)

```bash
# Si Anthropic échoue, ces alternatives peuvent être utilisées
GEMINI_API_KEY=xxx...       # Fallback: Google Gemini
OPENAI_API_KEY=sk-proj-...  # Fallback: OpenAI (legacy)
```

### Autres variables (non affectées par cette mise à jour)

```bash
# Email
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@dev4com.com
SMTP_PASS=votre-mot-de-passe

# AWS S3
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=xxx
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=xxx
NEXT_PUBLIC_AWS_S3_BUCKET=xxx

# Firebase
NEXT_PUBLIC_APIKEY=xxx
NEXT_PUBLIC_AUTHDOMAIN=dev4com-f17b2.firebaseapp.com
NEXT_PUBLIC_PROJECTID=dev4com-f17b2
NEXT_PUBLIC_STORAGEBUCKET=dev4com-f17b2.firebasestorage.app
NEXT_PUBLIC_MESSAGINGSENDERID=xxx
NEXT_PUBLIC_APPID=xxx
```

---

## 🧪 Tests de validation

### Test 1 : Vérifier la clé API

```bash
# Dans le terminal
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Bonjour"}]
  }'
```

**Résultat attendu :** Une réponse JSON avec le message de Claude

### Test 2 : Vérifier l'intégration dans le projet

```bash
# Vérifier que le fichier anthropic.ts est chargé
npm run build 2>&1 | grep -i anthropic

# Doit afficher le chemin du fichier sans erreur
```

### Test 3 : Test complet du chatbot

1. Démarrez le serveur : `npm run dev`
2. Ouvrez http://localhost:3000
3. Ouvrez la console navigateur (F12)
4. Allez dans l'onglet Network
5. Cliquez sur le chat et tapez un message
6. Vérifiez que :
   - L'URL `/api/chat` reçoit un POST
   - La réponse contient `message` et `suggestions`
   - Pas d'erreur 401 (clé invalide)
   - Pas d'erreur 429 (rate limit)

### Test 4 : Test de capture d'email

```
Vous : "Je veux créer une boutique, mon email est test@exemple.com"
Claude doit :
- Détecter l'email
- Répondre avec confirmation
- Dans les logs serveur : "Email captured: test@exemple.com"
```

---

## 🔧 Dépannage

### ❌ Erreur : "Clé API Anthropic invalide"

**Cause :** ANTHROPIC_API_KEY n'est pas définie ou invalide

**Solution :**
```bash
# 1. Vérifiez la clé
echo $ANTHROPIC_API_KEY

# 2. Regénérez la clé sur https://console.anthropic.com/
# 3. Mettez à jour .env.local
# 4. Redémarrez le serveur : npm run dev
```

### ❌ Erreur : "Limite de requêtes atteinte (429)"

**Cause :** Vous avez atteint votre quota d'API (dépend de votre plan Anthropic)

**Solution :**
```bash
# 1. Vérifiez votre plan sur https://console.anthropic.com/
# 2. Attendez que le quota se réinitialise
# 3. Ou upgrader votre plan

# Logs serveur :
tail -f .next/logs/build.log | grep "429\|rate limit"
```

### ❌ Erreur : "Service Anthropic temporairement indisponible"

**Cause :** Les serveurs Anthropic ont un problème (rare)

**Solution :**
```bash
# 1. Vérifiez le statut : https://status.anthropic.com/
# 2. Attendez quelques minutes
# 3. Redémarrez le serveur
```

### ❌ Le chatbot répond toujours la même chose

**Cause :** Claude cache trop ses réponses (température trop basse)

**Solution :** Modifiez le fichier `/src/lib/anthropic.ts` :
```typescript
// Ligne ~134
temperature: 1.0, // Augmentez de 0.9 à 1.0 pour plus de variété
```

Puis redémarrez : `npm run dev`

### ❌ Pas de capture d'email

**Cause :** Claude ne détecte pas ou n'inclut pas le tag EMAIL_CAPTURED

**Solution :**
```bash
# 1. Vérifiez les logs serveur
npm run dev

# Cherchez : [Anthropic] Email captured

# 2. Si pas trouvé, le prompt peut être amélioré
# Voir : /src/lib/anthropic.ts ligne 50-80
```

---

## 📊 Monitoring et logs

### Voir tous les appels à l'API Anthropic

```bash
# Démarrer le serveur avec logs détaillés
DEBUG=* npm run dev 2>&1 | grep -i "anthropic\|claude\|email"
```

### Vérifier les performances

```bash
# Mesurer le temps de réponse moyen
npm run dev 2>&1 | grep "\[Anthropic\]" | tail -20
```

---

## 🎯 Optimisations recommandées

### Pour réduire les coûts API :

```typescript
// Dans /src/lib/anthropic.ts
max_tokens: 512,  // Réduire de 1024 à 512 si réponses trop longues
temperature: 0.7, // Réduire de 0.9 à 0.7 pour plus de déterminisme
```

### Pour améliorer la qualité des réponses :

```typescript
// Augmenter max_tokens
max_tokens: 1500, // Permet des réponses plus élaborées
```

---

## 📚 Documentation de référence

| Ressource | URL |
|-----------|-----|
| Console Anthropic | https://console.anthropic.com/ |
| Docs API | https://docs.anthropic.com/ |
| Pricing | https://www.anthropic.com/pricing |
| Status | https://status.anthropic.com/ |
| Models | https://docs.anthropic.com/en/docs/about/models |

---

## ✨ Prochaines étapes

### 1. Configurer les notifications de leads
- [ ] Setup SMTP pour envoyer emails aux leads
- [ ] Configurer template email client
- [ ] Configurer template email admin

### 2. Ajouter du monitoring
- [ ] Setup logging (Sentry, LogRocket, etc)
- [ ] Créer dashboard de conversion
- [ ] Alertes sur erreurs API

### 3. Optimiser le prompt
- [ ] Tester différentes stratégies de vente
- [ ] A/B testing des réponses
- [ ] Ajouter personnalisation par secteur

### 4. Améliorer l'UX
- [ ] Ajouter typing indicator plus naturel
- [ ] Activer voice input
- [ ] Support multilingue

---

## 📞 Support

**En cas de problème :**

1. Vérifiez que ANTHROPIC_API_KEY est correctement définie
2. Consultez les logs : `npm run dev`
3. Testez l'API directement : https://docs.anthropic.com/en/docs/build-a-basic-cli-chat-app
4. Contact Anthropic : support@anthropic.com

---

**Version :** 1.0
**Dernière mise à jour :** 2026-01-05
**État :** ✅ Production Ready
