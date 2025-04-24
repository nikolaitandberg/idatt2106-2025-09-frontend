"use client";

import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[FFF9F8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Logg inn</h1>
        <div>
          <TextInput
            label="E-post"
            name="email"
            type="email"
            placeholder="din@epost.no"
            validate={(value) => value.includes("@")}
          />

          <TextInput
            label="Passord"
            name="password"
            type="password"
            placeholder="••••••••"
            validate={(value) => value.length >= 6}
          />

          <Button className="size-full">Logg inn</Button>
        </div>
      </div>
    </div>
  );
}
