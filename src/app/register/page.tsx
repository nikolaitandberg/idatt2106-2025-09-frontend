"use client";

import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { sendRegisterRequest } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { ApiError } from "@/types/apiResponses";

export default function () {
  const router = useRouter();

  const {
    isPending,
    isError,
    error,
    mutate: register,
  } = useMutation({
    mutationFn: async ({ email, username, password }: { email: string; username: string; password: string }) => {
      return await sendRegisterRequest(email, username, password);
    },
  });

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    register(
      {
        username: (event.currentTarget as HTMLFormElement).username.value,
        password: (event.currentTarget as HTMLFormElement).password.value,
        email: (event.currentTarget as HTMLFormElement).email.value,
      },
      {
        onSuccess: (data) => {
          signIn("token", {
            token: data.token,
            redirect: false,
          }).then(() => {
            router.push("/");
          });
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Registrer deg</h1>
        <form onSubmit={handleRegister}>
          <TextInput
            label="E-post"
            name="email"
            type="email"
            placeholder="epost"
            validate={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
          />
          <TextInput
            label="Brukernavn"
            name="username"
            type="text"
            placeholder="brukernavn"
            validate={(value) => value.length > 0}
          />
          <TextInput label="Passord" name="password" type="password" placeholder="passord" />
          <TextInput
            label="Bekreft passord"
            name="confirmPassword"
            type="password"
            placeholder="passord"
            validate={(value) => value.length >= 6}
          />
          <Button className="size-full h-12 text-md" type="submit">
            {isPending ? <LoadingSpinner /> : "Registrer deg"}
          </Button>
        </form>
        {isError && (
          <div className="text-red-500 text-sm text-center">
            {error instanceof ApiError ? error.message : "Noe gikk galt. Vennligst prøv igjen."}
          </div>
        )}
        <div className="flex justify-center">
          <p className="text-sm text-gray-500">
            Har du allerede en konto?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Logg inn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
