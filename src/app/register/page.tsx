"use client";

import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { sendRegisterRequest } from "@/actions/auth";

export default function () {
  const { isPending, mutate: register } = useMutation({
    mutationFn: async ({ username, password, email }: { username: string; password: string; email: string }) => {
      return await sendRegisterRequest(username, password, email);
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
            redirect: true,
            callbackUrl: "/",
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
          <TextInput
            label="Passord"
            name="password"
            type="password"
            placeholder="passord"
            validate={(value) => value.length >= 6}
          />
          <TextInput
            label="Bekreft passord"
            name="confirmPassword"
            type="password"
            placeholder="passord"
            validate={(value) => value.length >= 6}
          />
          <Button className="size-full h-12 text-md" type="submit">
            Registrer
          </Button>
        </form>
      </div>
    </div>
  );
}
