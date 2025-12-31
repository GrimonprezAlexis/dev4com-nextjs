# ChatBot DEV4COM - Guide d'intégration Gemini

## Configuration

Le chatbot utilise maintenant l'API Gemini de Google au lieu d'OpenAI pour des réponses plus rapides et économiques.

### 1. Clé API Gemini

Ajoutez votre clé API Gemini dans le fichier `.env.local` :

```bash
GEMINI_API_KEY=votre-clé-api-gemini
```

### 2. Installation des dépendances

Les dépendances ont déjà été installées :
```bash
npm install @google/generative-ai
```

## Fonctionnalités implémentées

### ✅ Intégration Gemini
- Modèle : `gemini-1.5-pro-latest` (dernière version Gemini 1.5 Pro)
- Package : `@google/generative-ai` v0.24.1
- Température : 0.7 (équilibre créativité/précision)
- Limite de tokens : 200 (réponses concises)

### ✅ Amélirations UX
- **Message de bienvenue** automatique à l'ouverture
- **Réponses rapides** : 4 boutons de suggestions après le message de bienvenue
  - "Créer un site web"
  - "Automatisation IA"
  - "Améliorer mon SEO"
  - "Demander un devis"
- **Historique de conversation** : Les 6 derniers messages sont envoyés pour le contexte
- **Format d'heure français** : HH:MM au format 24h
- **Loading spinner** pendant le traitement
- **Gestion d'erreurs** améliorée avec messages en français

### ✅ Optimisations
- Contexte limité aux 6 derniers messages pour optimiser les coûts
- Réponses limitées à 200 tokens max (2-3 phrases)
- Prompt système optimisé pour des réponses courtes et actionables

## Fichiers modifiés

1. **`/src/lib/gemini.ts`** (nouveau) - Configuration et fonction de génération Gemini
2. **`/src/app/api/chat/route.ts`** - Route API mise à jour pour utiliser Gemini
3. **`/src/components/Chatbot.tsx`** - Interface améliorée avec réponses rapides et message de bienvenue
4. **`.env.local`** - Ajout de GEMINI_API_KEY

## Prompt système

Le chatbot est configuré pour :
- Représenter l'agence DEV4COM
- Répondre en français uniquement
- Être professionnel mais humain
- Donner des réponses brèves (2-3 phrases max)
- Orienter vers l'action (devis, contact, rendez-vous)
- Connaître les services : sites web, SEO, automatisation IA, design, etc.

## Test

Pour tester le chatbot :
1. Lancez le serveur : `npm run dev`
2. Ouvrez le site
3. Cliquez sur le bouton de chat en bas à droite
4. Testez les réponses rapides ou posez une question

## Note importante

⚠️ **La clé API Gemini doit être remplacée** dans `.env.local` par la vraie clé fournie par l'utilisateur.
La valeur actuelle `your-gemini-api-key-here` est un placeholder.
