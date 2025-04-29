"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const handleLogin = async ({ username, password }: { username: string; password: string }) => {
    setLoginError(null);
    const loginResponse = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (loginResponse?.ok) {
      router.replace("/");
      return;
    }

    if (loginResponse?.status === 401) {
      setLoginError("Ugyldig brukernavn eller passord");
      return;
    }
    setLoginError("Noe gikk galt. Vennligst prøv igjen senere.");
  };

  const loginForm = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
      onSubmitAsync: async ({ value }) => handleLogin(value),
    },
  });

  return (
    <div className="flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Logg inn</h1>
        <loginForm.AppField name="username">
          {(field) => <field.TextInput label="Brukernavn" placeholder="brukernavn" />}
        </loginForm.AppField>
        <loginForm.AppField name="password">
          {(field) => <field.TextInput label="Passord" type="password" placeholder="passord" />}
        </loginForm.AppField>
        <loginForm.AppForm>
          <loginForm.SubmitButton>Logg inn</loginForm.SubmitButton>
        </loginForm.AppForm>
        <div className="text-red-500 text-sm text-center">{loginError && <p>{loginError}</p>}</div>
        <div className="flex justify-center">
          <p className="text-sm text-gray-500">
            Har du ikke en konto?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Registrer deg
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
