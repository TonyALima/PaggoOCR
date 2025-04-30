import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  // Authenticate the user
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error("BACKEND_URL is not defined in the environment variables.");
    }
    
    const response = await fetch(`${backendUrl}/documents/user/${session.user!.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to fetch user documents" },
        { status: response.status }
      );
    }

    const userDocuments = await response.json();
    return NextResponse.json(userDocuments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}