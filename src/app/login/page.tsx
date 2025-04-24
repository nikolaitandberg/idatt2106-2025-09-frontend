"use client";

import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Logg inn</h1>
        <div>
          <TextInput
            label="E-post"
            name="email"
            type="text"
            placeholder="din@epost.no"
            validate={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
          />

          <TextInput
            label="Passord"
            name="password"
            type="password"
            placeholder="passord"
            validationErrorMessage="Passordet må være minst 6 tegn langt."
            validate={(value) => value.length >= 6}
          />

          <Button className="size-full">Logg inn</Button>
        </div>
      </div>
    </div>
  );
}
