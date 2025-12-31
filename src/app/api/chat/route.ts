import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    console.log('[Chat API] Processing message:', message.substring(0, 50));

    const response = await generateChatResponse(message, conversationHistory || []);

    if (!response || (typeof response !== "string" && typeof response !== "object")) {
      console.error("Invalid response:", response);
      return NextResponse.json(
        { error: "AI response invalid" },
        { status: 500 }
      );
    }

    console.log('[Chat API] Response generated successfully');

    // Handle both old string format and new object format
    if (typeof response === "string") {
      return NextResponse.json({
        message: response,
        suggestions: ["Recevoir des infos par email", "Demander un devis", "Créer un site web"]
      });
    }

    // Check if an email was captured
    if (response.capturedEmail) {
      console.log('[Chat API] Email captured:', response.capturedEmail);

      // Generate conversation summary
      const conversationSummary = conversationHistory
        .slice(-6)
        .map((msg: any) => `${msg.role === 'user' ? 'Client' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // Send lead email in background (don't wait for it)
      fetch(`${request.url.replace(/\/api\/chat.*$/, '')}/api/send-lead-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: response.capturedEmail,
          conversationSummary,
        }),
      }).catch((err) => {
        console.error('[Chat API] Failed to send lead email:', err);
      });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Chat API error:", {
      message: error?.message,
      stack: error?.stack,
      error: error
    });

    // Return detailed error message
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error?.message || "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}
