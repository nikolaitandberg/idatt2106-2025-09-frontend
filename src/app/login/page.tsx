"use client";

import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSigningIn(true);
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Logg inn</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <TextInput
            label="Brukernavn"
            name="username"
            type="text"
            placeholder="brukernavn"
            validate={(value) => value.length > 0}
          />

          <TextInput
            label="Passord"
            name="password"
            type="password"
            placeholder="passord"
            validationErrorMessage="Passordet må være minst 6 tegn langt."
            validate={(value) => value.length >= 6}
          />

          <Button className="size-full" type="submit">
            {isSigningIn ? <LoadingSpinner /> : "Logg inn"}
          </Button>
        </form>
      </div>
    </div>
  );
}
