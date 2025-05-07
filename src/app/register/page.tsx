"use client";

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
import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";

type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  recaptchaToken: string;
};

export default function Register() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const siteKey = process.env.RECAPTCHA_SITE_KEY;
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
      recaptchaToken: z.string().min(1, { message: "reCAPTCHA verifisering er påkrevd" }),
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
    mutationFn: async ({ username, password, email, recaptchaToken }: RegisterRequest) => {
      return await sendRegisterRequest(email, username, password, recaptchaToken);
    },
  });

  const defaultRegister: RegisterRequest & { repeatPassword: string } = {
    username: "",
    password: "",
    email: "",
    repeatPassword: "",
    recaptchaToken: "",
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

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaError(null);
    form.setFieldValue("recaptchaToken", token || "");
    setTimeout(() => form.validate("change"), 0);
  };

  const handleRegister = async (req: RegisterRequest & { repeatPassword: string }) => {
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
        onError: () => {
          recaptchaRef.current?.reset();
          form.setFieldValue("recaptchaToken", "");
        },
      });
    });
  };
  return (
    <div className="flex items-center justify-center bg-background px-4 mt-8">
      <div className="w-full max-w-md rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Registrer deg</h1>
        <form.AppField name="username">{(field) => <field.TextInput label="Brukernavn" />}</form.AppField>
        <form.AppField name="email">{(field) => <field.TextInput label="E-post" type="email" />}</form.AppField>
        <form.AppField name="password">{(field) => <field.TextInput label="Passord" type="password" />}</form.AppField>
        <form.AppField name="repeatPassword">
          {(field) => <field.TextInput label="Gjenta passord" type="password" />}
        </form.AppField>
        <div className="flex justify-center">
          <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey ?? ""} onChange={handleRecaptchaChange} />
        </div>
        {recaptchaError && <div className="text-red-500 text-sm text-center">{recaptchaError}</div>}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button size="fullWidth" disabled={!canSubmit} onClick={() => form.handleSubmit()}>
              {isSubmitting ? <LoadingSpinner /> : "Registrer deg"}
            </Button>
          )}
        </form.Subscribe>
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
