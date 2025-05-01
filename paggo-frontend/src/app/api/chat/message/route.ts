import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Get the session
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { message, documentId } = body;

    if (!message || !documentId) {
      return NextResponse.json(
        { error: "Message and Document ID are required" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error("BACKEND_URL is not defined in the environment variables.");
    }

    const userId = session.user!.id;
    const response = await fetch(`${backendUrl}/llm/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY || "",
      },
      body: JSON.stringify({
        userId,
        documentId,
        question: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to process the message" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}