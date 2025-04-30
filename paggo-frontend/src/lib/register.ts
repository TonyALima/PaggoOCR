import { hashPassword } from "./utils";

export async function register(name: string, email: string, password: string): Promise<string | null> {
    try {
        
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password: await hashPassword(password) }),
        });
        if (!response.ok) {
            return null;
        }
  
        const { message } = await response.json();
        return message;
    } catch (error) {
        console.error("Error registering user:", error);
        return null;
    }
  }