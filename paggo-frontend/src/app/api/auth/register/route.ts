import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {

  try {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error("BACKEND_URL is not defined in the environment variables.");
    }
    const {name, email, password} = await request.json();
    
    if (!name || !email || !password) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }
    const response = await fetch(backendUrl + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.BACKEND_API_KEY || "",
        },
        body: JSON.stringify({ name, email, password: password }),
    });
    console.log("Response from backend:", response);
    if (!response.ok) {
        throw new Error("Failed to register user");
    }

    const { message } = await response.json();
    
    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}