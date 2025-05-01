import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { hashPassword } from "@/lib/utils";

export const { handlers, signIn, auth } = NextAuth({
    providers: [Credentials({
        credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "text" },
        },
        authorize: async (credentials) => {
            try {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Missing credentials.");
                }                
                const email = credentials.email as string;
                const password = credentials.password as string;
                const passwordHash = await hashPassword(password);

                const userId = await getUserIdFromDb(email, passwordHash);

                if (!userId) {
                    throw new Error("Invalid credentials.");
                }
                
                return { id: userId, email: email }; // Ensure `id` is returned
            } catch (error) {
                console.error("Error in authorize:", error);
                throw new Error("Invalid credentials.");
            }
        }
    })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) {
                token.sub = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub as string;
            }
            return session;
        }
    }
});

async function getUserIdFromDb(email: string, passwordHash: string): Promise<string | null> {
    try {
        const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
        const response = await fetch(backendUrl + "/auth/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.BACKEND_API_KEY || "",
            },
            body: JSON.stringify({ email, passwordHash }),
        });
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.message; // API returns { message: userId }
    } catch (error) {
        console.error("Error validating user:", error);
        return null;
    }
}