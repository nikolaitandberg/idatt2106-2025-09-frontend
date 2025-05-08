"use client";

declare global {
  interface Window {
    onloadTurnstileCallback: () => void;
  }

  const turnstile: {
    render: (
      containerId: string,
      options: {
        sitekey: string;
        callback: (token: string) => void;
      },
    ) => void;
  };
}

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { sendRegisterRequest } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { ApiError } from "@/types/apiResponses";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { useEffect, useState } from "react";

type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  captchaToken: string;
};

export default function Register() {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
    script.defer = true;
    document.body.appendChild(script);

    window.onloadTurnstileCallback = function () {
      turnstile.render("#captcha-container", {
        sitekey: "0x4AAAAAABbjtdnnMWVICeky",
        callback: function (token: string) {
          setCaptchaToken(token);
          form.setFieldValue("captchaToken", token || "");

          // tvinge form-validering når captchatoken er satt
          // vet ikke hvorfor denne ikke kan gjøres uten setTimeout, men sånn er det iaf - Nikolai
          setTimeout(() => form.validate("change"), 0);
        },
      });
    };

    return () => {
      document.body.removeChild(script);
    };
    // ikke fjern denne tomme arrayen, den er nødvendig for at cloudflare-scriptet skal fungere
  }, []);

  const registerSchema = z
    .object({
      username: z.string().min(3, { message: "Brukernavn må være minst 3 tegn" }),
      password: z
        .string()
        .min(8, { message: "Passord må være minst 8 tegn" })
        .regex(/(?=.*\d)/, {
          message: "Passord må inneholde minst ett tall",
        })
        .regex(/(?=.*[a-zA-Z])/, {
          message: "Passord må inneholde minst én bokstav",
        }),
      email: z.string().email({ message: "Ugyldig e-postadresse" }),
      repeatPassword: z.string(),
      captchaToken: z.string().min(1, { message: "Captcha er påkrevd" }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "Passordene er ikke like",
      path: ["repeatPassword"],
    });

  const {
    isError,
    error,
    mutate: register,
  } = useMutation({
    mutationFn: async ({ username, password, email, captchaToken }: RegisterRequest) => {
      return await sendRegisterRequest(email, username, password, captchaToken);
    },
  });

  const defaultRegister: RegisterRequest & { repeatPassword: string } = {
    username: "",
    password: "",
    email: "",
    captchaToken: captchaToken || "",
    repeatPassword: "",
  };

  const form = useAppForm({
    validators: {
      onChange: registerSchema,
    },
    defaultValues: defaultRegister,
    onSubmit: async ({ value }) => {
      await handleRegister(value);
    },
  });

  const handleRegister = async (req: RegisterRequest) => {
    return await new Promise((resolve) => {
      register(req, {
        onSuccess: (data) => {
          signIn("token", {
            token: data.token,
            redirect: false,
          });
          router.push("/");
        },
        onSettled: resolve,
      });
    });
  };
  return (
    <div className="flex items-center justify-center bg-background px-4 mt-8">
      <div className="w-full max-w-md rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Registrer deg</h1>
        <form.AppField name="username">
          {(field) => <field.TextInput label="Brukernavn" placeholder="Nytt brukernavn" />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => <field.TextInput label="E-post" type="email" placeholder="Skriv din e-post" />}
        </form.AppField>
        <form.AppField name="password">
          {(field) => <field.TextInput label="Passord" type="password" placeholder="Skriv ditt nye passord" />}
        </form.AppField>
        <form.AppField name="repeatPassword">
          {(field) => (
            <field.TextInput label="Gjenta passord" type="password" placeholder="Skriv inn passordet på nytt" />
          )}
        </form.AppField>
        <form.AppField name="captchaToken">
          {() => <div id="captcha-container" className="flex justify-center"></div>}
        </form.AppField>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button size="fullWidth" disabled={!canSubmit} onClick={() => form.handleSubmit()}>
              {isSubmitting ? <LoadingSpinner /> : "Registrer deg"}
            </Button>
          )}
        </form.Subscribe>
        {isError && (
          <div className="text-red-700 text-sm text-center">
            {error instanceof ApiError ? error.message : "Noe gikk galt. Vennligst prøv igjen."}
          </div>
        )}
        <div className="flex justify-center">
          <p className="text-sm text-gray-500">
            Har du allerede en konto?{" "}
            <Link href="/login" className="text-blue-700 hover:underline">
              Logg inn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
