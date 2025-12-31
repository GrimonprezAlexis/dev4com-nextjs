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

    if (!response || typeof response !== "string") {
      console.error("Invalid response:", response);
      return NextResponse.json(
        { error: "AI response invalid" },
        { status: 500 }
      );
    }

    console.log('[Chat API] Response generated successfully');
    return NextResponse.json({ message: response });
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
