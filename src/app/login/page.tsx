"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import PasswordResetDialog from "@/components/login/PasswordResetDialog";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import LoadingSpinner from "@/components/ui/loadingSpinner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
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
      callbackUrl: returnUrl,
    });

    if (loginResponse?.ok) {
      router.replace(returnUrl);
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
    <div className="w-full max-w-md rounded-2xl p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center" data-testid="login-title">Logg inn</h1>
      <loginForm.AppField name="username">
        {(field) => <field.TextInput data-testid="input-username" label="Brukernavn" placeholder="brukernavn" />}
      </loginForm.AppField>
      <loginForm.AppField data-testid="input-password" name="password">
        {(field) => <field.TextInput 
          label="Passord" 
          type="password" 
          placeholder="passord"
        />}
      </loginForm.AppField>
      <loginForm.AppForm>
        <loginForm.SubmitButton  data-testid="submit-login">Logg inn</loginForm.SubmitButton>
      </loginForm.AppForm>
      <div className="text-red-700 text-sm text-center">{loginError && <p>{loginError}</p>}</div>
      <div className="flex justify-center flex-col">
        <p className="text-sm text-gray-500">
          Har du ikke en konto?{" "}
          <Link href="/register" className="text-blue-700 hover:underline">
            Registrer deg
          </Link>
        </p>
        <p className="text-sm text-gray-500">
          Glemt passord? <PasswordResetDialog />
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center bg-background px-4 mt-8">
      <Suspense fallback={<div><LoadingSpinner /></div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
