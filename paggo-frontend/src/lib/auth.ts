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
                let user = null;
                const email = credentials.email as string;
                const password = credentials.password as string;

                user = await getUserIdFromDb(email, password);

                if (!user) {
                    throw new Error("Invalid credentials.");
                }

                return { email: email, id: user };
            } catch (error) {
                console.error("Error in authorize:", error);
                throw new Error("Invalid credentials.");
            }
        }
    })
    ],
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
        return data.message; // Assuming the API returns { message: userId }
    } catch (error) {
        console.error("Error validating user:", error);
        return null;
    }
}