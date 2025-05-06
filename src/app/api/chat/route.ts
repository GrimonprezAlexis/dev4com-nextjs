import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const response = await generateChatResponse(message);

    if (!response || typeof response !== "string") {
      console.error("Invalid response:", response);
      return NextResponse.json(
        { error: "AI response invalid" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
