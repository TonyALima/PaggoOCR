import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Get the session
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  // Check if the request is a multipart/form-data
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 400 }
    );
  }
  // Parse the data
  const body = await request.json();
  const { message } = body;

  if (message) {
    return NextResponse.json(
      { response: `Recebi sua mensagem: "${message}". Em um sistema real, eu processaria isso.`},
      { status: 200 }
    );
  }
 
  return NextResponse.json(
    { error: "Invalid request" },
    { status: 400 }
  );
}