import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic API client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Ultra-concise system prompt for Dev4COM AI Assistant
 * Optimized for short, fast responses with high conversion
 */
const systemPrompt = `Tu es l'Assistant IA de DEV4COM, agence web spécialisée en création de sites, e-commerce, SEO et automatisation IA.

OBJECTIF : Obtenir le contact (email) du visiteur en 2-3 échanges rapides.

SERVICES :
- Sites web modernes (maquette gratuite)
- E-commerce sécurisé
- SEO et visibilité
- Automatisation IA/CRM
- Maintenance 1 an gratuite

RÈGLES ABSOLUES :
1. ⚡ RÉPONSE ULTRA-COURTE : 1-2 phrases MAX (5-10 mots par phrase)
2. 🎯 Va vite vers l'email (2-3 messages max)
3. 💬 Termine TOUJOURS par une question
4. 📧 Si @ détecté : "EMAIL_CAPTURED:[email]" au début
5. 📋 Format exact : [réponse courte]\n---SUGGESTIONS---\nSugg1|||Sugg2|||Sugg3

FLUX RAPIDE :
- Message 1 : Accueille + demande besoin
- Message 2 : Valeur + demande email
- Message 3 : Confirmation + prochaines étapes

EXEMPLES :
1. Visiteur: "Bonjour" → "Salut ! Site web, e-commerce ou SEO ?" + suggestions
2. Visiteur: "Site web" → "On crée des sites modernes en 4-6 semaines + maquette gratuite. Email ?" + suggestions
3. Visiteur: "test@ex.com" → "EMAIL_CAPTURED:test@ex.com Parfait ! Vous recevrez notre dossier dans 5 min."

OBJECTIONS RAPIDES :
- "Trop cher" → "Investissement rentabilisé en clients gagnés. Email pour devis ?"
- "Je vais réfléchir" → "OK ! Je vous envoie notre portfolio pour bien réfléchir. Email ?"

IMPORTANT : Sois pro mais COURT. Zéro paragraphes. Zéro explications longues.`;

/**
 * Process chat message and generate professional response
 * Uses Claude Opus 4.5 (latest frontier model) for superior reasoning and context understanding
 */
export async function generateChatResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
) {
  try {
    // Validate API key
    if (
      !process.env.ANTHROPIC_API_KEY ||
      process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key"
    ) {
      console.error("Anthropic API key not configured");
      throw new Error(
        "Configuration API manquante - Veuillez configurer ANTHROPIC_API_KEY"
      );
    }

    console.log("[Anthropic] API Key loaded:",
      `${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...`
    );

    // Build messages array for Claude with conversation history
    const messages: Array<{ role: "user" | "assistant"; content: string }> =
      [];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    console.log("[Anthropic] Sending request to Claude Opus 4.5...");

    // Call Claude API with optimized parameters for speed and conciseness
    const response = await client.messages.create({
      model: "claude-opus-4-5-20251101",
      max_tokens: 200, // Ultra-reduced for short responses
      system: systemPrompt,
      messages: messages,
      temperature: 0.6, // Lower for deterministic, concise responses
    });

    // Extract response text
    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    if (!assistantMessage || assistantMessage.trim().length === 0) {
      console.error("[Anthropic] Empty response received");
      return {
        message:
          "Je suis à votre écoute ! Dites-moi en plus sur votre projet digital et comment je peux vous aider.",
        suggestions: [
          "Créer un site web",
          "Lancer un e-commerce",
          "Optimiser mon SEO",
        ],
      };
    }

    // Parse response to extract message and suggestions
    const trimmedText = assistantMessage.trim();
    const parts = trimmedText.split("---SUGGESTIONS---");

    let message = parts[0].trim();
    let suggestions: string[] = [];
    let capturedEmail: string | null = null;

    // Check for email capture tag (appears at start of message)
    const emailCaptureMatch = message.match(/EMAIL_CAPTURED:\s*([^\s]+@[^\s]+)/);
    if (emailCaptureMatch) {
      capturedEmail = emailCaptureMatch[1];
      console.log("[Anthropic] Email captured:", capturedEmail);
      // Remove the tag from the visible message
      message = message.replace(/EMAIL_CAPTURED:\s*[^\s]+@[^\s]+\s*/g, "").trim();
    }

    // Extract suggestions
    if (parts.length > 1) {
      const suggestionsText = parts[1].trim();
      suggestions = suggestionsText
        .split("|||")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    // Fallback suggestions if none provided
    if (suggestions.length === 0) {
      suggestions = [
        "Discuter du projet",
        "Voir des exemples",
        "Envoyer mon email",
      ];
    }

    // Ensure exactly 3 suggestions
    while (suggestions.length < 3) {
      const fallbacks = [
        "Poser une question",
        "En savoir plus",
        "Voir le portfolio",
      ];
      suggestions.push(fallbacks[suggestions.length % fallbacks.length]);
    }
    suggestions = suggestions.slice(0, 3);

    return {
      message,
      suggestions,
      capturedEmail,
    };
  } catch (error: any) {
    console.error("[Anthropic] API Error Details:", {
      message: error?.message,
      status: error?.status,
      error: error,
    });

    // Enhanced error handling
    if (
      error?.message?.includes("API key") ||
      error?.message?.includes("401")
    ) {
      throw new Error(
        "Clé API Anthropic invalide - Veuillez vérifier votre configuration ANTHROPIC_API_KEY"
      );
    }

    if (error?.message?.includes("rate limit") || error?.status === 429) {
      throw new Error("Limite de requêtes atteinte - Veuillez patienter");
    }

    if (
      error?.status === 500 ||
      error?.status === 503 ||
      error?.message?.includes("503")
    ) {
      throw new Error("Service Anthropic temporairement indisponible");
    }

    if (error?.message?.includes("overloaded")) {
      throw new Error("Service surchargé - Réessayez dans quelques secondes");
    }

    throw new Error(
      `Erreur Anthropic: ${error?.message || "Erreur inconnue"}`
    );
  }
}
