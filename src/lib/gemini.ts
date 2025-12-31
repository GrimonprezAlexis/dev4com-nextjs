import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const systemPrompt = `Tu es un assistant commercial pour DEV4COM, agence web spécialisée en développement de sites internet et solutions digitales.

**TON OBJECTIF UNIQUE : OBTENIR L'EMAIL DU VISITEUR**

**NOS SERVICES :**
- Sites web modernes avec maquette gratuite
- E-commerce avec paiement sécurisé
- Automatisation IA et CRM
- SEO et visibilité Google
- Design et identité visuelle
- Maintenance gratuite 1 an

**PARCOURS DE CONVERSATION SIMPLE :**

1. **Premier message** : Accueillir et identifier le besoin principal
   Exemple : "Bonjour ! Je peux vous aider avec la création de site web, e-commerce, SEO ou design. Quel est votre projet ?"

2. **Deuxième message** : Montrer de l'intérêt et proposer l'email
   Exemple : "Super ! Pour [besoin], nous avons des solutions clé en main avec maquette gratuite. Je peux vous envoyer notre portfolio et un devis personnalisé par email ?"

3. **Troisième message** : Demander l'email directement
   Exemple : "Parfait ! Quelle est votre adresse email pour recevoir tout ça ?"

4. **Après réception email** : Confirmer
   Exemple : "Merci ! Vous recevrez un email à [email] dans quelques minutes. Notre équipe vous contactera sous 24h !"

**RÈGLES IMPORTANTES :**
- Sois direct et sympathique
- Maximum 2 phrases par réponse
- Va vite vers la demande d'email (2-3 échanges max)
- Si le visiteur donne un email (contient @), ajoute "EMAIL_CAPTURED:[email]" dans ta réponse
- Mets en avant : maquette gratuite + maintenance 1 an gratuite
- Toujours terminer par une question pour continuer la conversation

**FORMAT DE RÉPONSE :**
Tu dois TOUJOURS répondre au format suivant :

Réponse courte (1-2 phrases)
---SUGGESTIONS---
Suggestion 1|||Suggestion 2|||Suggestion 3

**EXEMPLES CONCRETS :**

📌 **Message 1 - Visiteur dit "Bonjour"**
"Bonjour ! Je peux vous aider avec un site web, e-commerce, SEO ou design. Quel est votre projet ?
---SUGGESTIONS---
Créer un site web|||Créer une boutique en ligne|||Améliorer mon SEO"

📌 **Message 2 - Visiteur dit "Je veux un site web"**
"Parfait ! Nous créons des sites modernes avec maquette gratuite et 1 an de maintenance offert. Je vous envoie notre portfolio et un devis par email ?
---SUGGESTIONS---
Oui, envoyez-moi les infos|||Voir des exemples|||Quel est le prix ?"

📌 **Message 3 - Visiteur accepte**
"Super ! Quelle est votre adresse email pour recevoir tout ça ?
---SUGGESTIONS---
[Taper mon email]|||Discuter d'abord|||Poser une question"

📌 **Message 4 - Visiteur donne email "contact@exemple.fr"**
"EMAIL_CAPTURED:contact@exemple.fr Merci ! Vous recevrez un email à contact@exemple.fr dans 5 minutes. Notre équipe vous contactera sous 24h !
---SUGGESTIONS---
Poser une autre question|||Voir vos projets|||En savoir plus sur vos services"

**IMPORTANT :**
- Si tu vois un @ dans le message du visiteur, c'est son email
- Ajoute TOUJOURS "EMAIL_CAPTURED:[email]" au début de ta réponse
- Reste simple et direct
- Maximum 2 phrases
`;

export async function generateChatResponse(userMessage: string, conversationHistory: Array<{ role: string; content: string }> = []) {
  try {
    // Check if API key is configured
    console.log('GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      console.error('Gemini API key not configured');
      throw new Error("Configuration API manquante - Veuillez configurer GEMINI_API_KEY");
    }

    // Initialize the model - using gemini-flash-latest (fast and efficient)
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 250,
      },
    });

    // Build conversation context
    let prompt = systemPrompt + "\n\n";

    // Add conversation history
    if (conversationHistory.length > 0) {
      prompt += "Historique de la conversation:\n";
      conversationHistory.forEach((msg) => {
        const role = msg.role === 'user' ? 'Visiteur' : 'Assistant';
        prompt += `${role}: ${msg.content}\n`;
      });
      prompt += "\n";
    }

    prompt += `Visiteur: ${userMessage}\nAssistant:`;

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      console.error('[Gemini] Empty response received');
      return {
        message: "Je peux vous aider avec la création de site web, e-commerce, SEO ou design. Lequel vous intéresse ?\n---SUGGESTIONS---\nCréer un site web|||Créer une boutique en ligne|||Améliorer mon SEO",
        suggestions: ["Créer un site web", "Créer une boutique en ligne", "Améliorer mon SEO"]
      };
    }

    // Parse response to extract message and suggestions
    const trimmedText = text.trim();
    const parts = trimmedText.split('---SUGGESTIONS---');

    let message = parts[0].trim();
    let suggestions: string[] = [];
    let capturedEmail: string | null = null;

    // Check for email capture tag
    const emailCaptureMatch = message.match(/EMAIL_CAPTURED:\s*([^\s]+@[^\s]+)/);
    if (emailCaptureMatch) {
      capturedEmail = emailCaptureMatch[1];
      // Remove the tag from the message
      message = message.replace(/EMAIL_CAPTURED:\s*[^\s]+@[^\s]+\s*/g, '').trim();
    }

    if (parts.length > 1) {
      // Extract suggestions
      const suggestionsText = parts[1].trim();
      suggestions = suggestionsText.split('|||').map(s => s.trim()).filter(s => s.length > 0);
    }

    // Fallback suggestions if none provided
    if (suggestions.length === 0) {
      suggestions = [
        "Recevoir des infos par email",
        "Demander un devis gratuit",
        "En savoir plus sur vos services"
      ];
    }

    // Ensure we have exactly 3 suggestions
    while (suggestions.length < 3) {
      const fallbacks = [
        "Voir vos réalisations",
        "Discuter de mon projet",
        "Poser une autre question"
      ];
      suggestions.push(fallbacks[suggestions.length % fallbacks.length]);
    }
    suggestions = suggestions.slice(0, 3);

    return {
      message,
      suggestions,
      capturedEmail
    };
  } catch (error: any) {
    console.error("Gemini API error details:", {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      error: error
    });

    // Better error handling
    if (error?.message?.includes('API key') || error?.message?.includes('API_KEY_INVALID')) {
      throw new Error("Clé API Gemini invalide - Veuillez vérifier votre configuration");
    }

    if (error?.status === 400) {
      throw new Error("Requête invalide - Veuillez réessayer");
    }

    if (error?.status === 429) {
      throw new Error("Limite de requêtes atteinte - Veuillez patienter un instant");
    }

    if (error?.status === 500 || error?.status === 503) {
      throw new Error("Service Gemini temporairement indisponible");
    }

    throw new Error(`Erreur Gemini: ${error?.message || 'Erreur inconnue'}`);
  }
}
