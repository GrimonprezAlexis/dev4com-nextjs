#!/bin/bash

echo "🤖 Configuration du ChatBot Gemini"
echo "=================================="
echo ""
echo "Veuillez entrer votre clé API Gemini :"
read -r GEMINI_KEY

if [ -z "$GEMINI_KEY" ]; then
    echo "❌ Erreur: Aucune clé API fournie"
    exit 1
fi

# Backup .env.local
cp .env.local .env.local.backup

# Remove old GEMINI_API_KEY line if exists
sed -i.tmp '/GEMINI_API_KEY=/d' .env.local && rm .env.local.tmp

# Add new GEMINI_API_KEY
echo "GEMINI_API_KEY=$GEMINI_KEY" >> .env.local

echo "✅ Clé API Gemini configurée avec succès!"
echo ""
echo "📝 Prochaines étapes :"
echo "1. Redémarrez le serveur de développement (npm run dev)"
echo "2. Testez le chatbot sur votre site"
echo ""
echo "💡 Consultez CHATBOT_README.md pour plus d'informations"
