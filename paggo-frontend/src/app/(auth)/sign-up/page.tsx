"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/register";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Cadastro</h1>
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>

      {/* Email/Password Sign Up */}
      <form
        className="space-y-4"
        action={async (formData: FormData) => {
          try {
            const message = await register(
              formData.get("name") as string,
              formData.get("email") as string,
              formData.get("password") as string
            );
            if (message) {
              router.push("/sign-in");
            }else {
              setError("Ocorreu um erro ao tentar cadastrar. Tente novamente.");
            }
          } catch (error) {
            console.error("Error during registration:", error);
            setError("Ocorreu um erro ao tentar cadastrar. Tente novamente.");
          }
        }}
      >
        <Input
          name="name"
          placeholder="Nome"
          type="name"
          required
        />
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Senha"
          type="password"
          required
          autoComplete="new-password"
        />
        <Button className="w-full" type="submit">
          Cadastrar
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-in">Já tem uma conta? Entre</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
