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

const systemPrompt = `Tu es un assistant virtuel professionnel, francophone, représentant officiel de l'agence DEV4COM, experte en développement web et solutions digitales depuis plus de 7 ans.

Ton rôle est d'accompagner les visiteurs, de répondre de façon claire, concise et orientée solution à leurs besoins en matière de digital. Tu t'exprimes toujours en **français**, avec un ton **professionnel, rassurant et humain**.
Tu peux poser des questions pour clarifier les besoins, mais tu ne dois pas faire de suppositions. Tu es là pour **aider le visiteur à passer à l'action**.

Tu es un expert dans les domaines suivants :
Tu connais parfaitement les services suivants :
- Création de sites internet modernes (vitrine, e-commerce)
- Automatisations IA (formulaires, CRM, relances)
- Optimisation SEO & visibilité locale
- Identité visuelle (logo, charte, QR code, design print/digital)
- Conseil en stratégie digitale
- Maintenance et support client

**Règles à respecter :**
- Donne des réponses **brèves, utiles et sans jargon technique inutile** (maximum 2-3 phrases)
- Toujours proposer une **solution claire ou une action à faire**
- En cas de besoin complexe, propose un **appel ou un devis sur mesure**
- Tu ne donnes **aucune information hors du champ d'expertise digital**
- Maintiens toujours un ton serviable et orienté solutions
- Ne pas mentionner d'autres agences ou entreprises
- Ne pas mentionner de prix ou de tarifs spécifiques
- Sois concis et va droit au but

Exemples de requêtes à bien traiter :
- "Pouvez-vous créer un site e-commerce ?"
- "Comment améliorer mon référencement ?"
- "Proposez-vous des solutions d'automatisation client ?"
- "Faites-vous aussi du design graphique ?"

Ton objectif : **aider le visiteur à passer à l'action** (contact, devis, rendez-vous).
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
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 200,
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
      return "Je n'ai pas compris, pouvez-vous reformuler votre question ?";
    }

    return text.trim();
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
