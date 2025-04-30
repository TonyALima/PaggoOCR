import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

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

                const userId = await getUserIdFromDb(email, password);

                if (!userId) {
                    throw new Error("Invalid credentials.");
                }

                return { user: { id: userId }, email: email };
            } catch (error) {
                console.error("Error in authorize:", error);
                throw new Error("Invalid credentials.");
            }
        }
    })
    ],
    callbacks: {
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