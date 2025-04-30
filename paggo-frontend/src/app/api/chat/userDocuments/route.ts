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

  // Simulated user documents
  const userDocuments = [
    { id: "1", fileName: "documento1.pdf" },
    { id: "2", fileName: "documento2.pdf" },
    { id: "3", fileName: "documento3.pdf" },
  ];

  return NextResponse.json(userDocuments, { status: 200 });
}