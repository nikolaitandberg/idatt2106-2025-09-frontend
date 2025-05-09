"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  captchaToken: string;
  acceptPrivacyPolicy: boolean;
};

export default function Register() {
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY;
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // cloudflare turnstile implementasjon
  // https://www.cloudflare.com/application-services/products/turnstile/
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="turnstile"]');
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
    script.defer = true;
    script.id = "turnstile-script";
    document.body.appendChild(script);

    window.onloadTurnstileCallback = function () {
      if (!sitekey) {
        console.warn("Turnstile site key is not defined, please check your environment variables.");
        return;
      }

      const container = document.getElementById("captcha-container");
      if (container && !container.hasChildNodes()) {
        turnstile.render("#captcha-container", {
          sitekey: sitekey,
          callback: function (token: string) {
            setCaptchaToken(token);
            form.setFieldValue("captchaToken", token || "");
            setTimeout(() => form.validate("change"), 0);
          },
        });
      }
    };

    return () => {
      const scriptToRemove = document.getElementById("turnstile-script");
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
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
      captchaToken: z.string().optional(),
      acceptPrivacyPolicy: z.boolean().refine((val) => val, {
        message: "Du må godta personvernserklæringen",
      }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "Passordene er ikke like",
      path: ["repeatPassword"],
    })
    .refine(
      (data) => {
        if (!sitekey) {
          return true;
        }

        return !!data.captchaToken;
      },
      {
        message: "Captcha er påkrevd",
        path: ["captchaToken"],
      },
    );

  const {
    isError,
    error,
    mutate: register,
  } = useMutation({
    mutationFn: async ({ username, password, email, captchaToken }: RegisterRequest) => {
      return await sendRegisterRequest(email, username, password, captchaToken);
    },
  });

  const defaultRegister: Omit<RegisterRequest, "captchaToken"> & { repeatPassword: string; captchaToken?: string } = {
    username: "",
    password: "",
    email: "",
    captchaToken: captchaToken || undefined,
    repeatPassword: "",
    acceptPrivacyPolicy: false,
  };

  const form = useAppForm({
    validators: {
      onChange: registerSchema,
    },
    defaultValues: defaultRegister,
    onSubmit: async ({ value }) => {
      await handleRegister({
        captchaToken: value.captchaToken!,
        ...value,
      });
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
        <form.AppField name="acceptPrivacyPolicy">
          {(field) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="privacyPolicy"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
              />
              <label htmlFor="privacyPolicy" className="text-sm text-gray-700">
                Jeg godtar{" "}
                <Link href="/privacy-policy" className="text-blue-700 hover:underline">
                  personvernserklæringen
                </Link>
              </label>
            </div>
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
