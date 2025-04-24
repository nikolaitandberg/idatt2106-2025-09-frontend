"use client";

import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";

export default function () {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[FFF9F8] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Registrer deg</h1>
        <div>
            <TextInput
                label="Fornavn"
                name="firstName"
                type="text"
                placeholder="Fornavn"
                validate={(value) => value.length > 0}
            />
            <TextInput
                label="Etternavn"
                name="lastName"
                type="text"
                placeholder="Etternavn"
                validate={(value) => value.length > 0}
            />
            <TextInput
                label="E-post"
                name="email"
                type="email"
                placeholder="din@mail.no"
                validate={(value) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  }
            />
            <TextInput
                label="Passord"
                name="password"
                type="password"
                placeholder="••••••••"
                validate={(value) => value.length >= 6}
            />
            <TextInput
                label="Bekreft passord"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                validate={(value) => value.length >= 6}
            />
            <Button className="size-full">Registrer</Button>
        </div>
      </div>
    </div>
  );
}
