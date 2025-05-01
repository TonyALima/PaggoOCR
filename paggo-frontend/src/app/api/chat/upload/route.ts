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
  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "User ID is not available in the session." },
      { status: 400 }
    );
  }
  // Check if the request is a multipart/form-data
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 400 }
    );
  }

  // Parse the form data
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400 }
    );
  }

  // Ensure the file is an image
  const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!validImageTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Uploaded file is not a valid image. Only PNG, JPEG, and JPG are allowed." },
      { status: 400 }
    );
  }

  // Prepare the file and additional data for the backend
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "BACKEND_URL is not defined in the environment variables." },
      { status: 500 }
    );
  }

  const backendFormData = new FormData();
  backendFormData.append("userId", userId);
  backendFormData.append("file", file);

  try {
    const response = await fetch(`${backendUrl}/documents/upload`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.BACKEND_API_KEY || "",
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error || "Failed to upload file to backend" },
        { status: response.status }
      );
    }

    const result = await response.json();
    const { documentId } = result;

    // Request explanation from LLM backend
    const llmResponse = await fetch(`${backendUrl}/llm/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY || "",
      },
      body: JSON.stringify({ userId, documentId }),
    });

    if (!llmResponse.ok) {
      const llmError = await llmResponse.json();
      return NextResponse.json(
        { error: llmError || "Failed to get explanation from LLM backend" },
        { status: llmResponse.status }
      );
    }

    const { explanation }=  await llmResponse.json();

    return NextResponse.json({
      documentId,
      explanation,
    },
      { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}