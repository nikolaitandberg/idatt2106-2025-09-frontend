"use client";

import { useParams, useRouter } from "next/navigation";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import Alert from "@/components/ui/alert";
import { useResetPassword } from "@/actions/user";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetSuccess, setResetSuccess] = useState(false);
  const params = useParams();
  const token = params.token as string;

  const { mutate: resetPassword, error, isError, isPending } = useResetPassword();

  const passwordSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "Passord må være minst 8 tegn." })
        .regex(/(?=.*\d)/, {
          message: "Passord må inneholde minst ett tall.",
        })
        .regex(/(?=.*[a-zA-Z])/, {
          message: "Passord må inneholde minst én bokstav.",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passordene må være like",
      path: ["confirmPassword"],
    });

  const handlePasswordReset = async ({ password }: { password: string; confirmPassword: string }) => {
    resetPassword(
      { token, password },
      {
        onSuccess: () => {
          setResetSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        },
      },
    );
  };

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: passwordSchema,
      onSubmitAsync: async ({ value }) => handlePasswordReset(value),
    },
  });

  return (
    <div className="flex items-center justify-center bg-background px-4 mt-8">
      <div className="w-full max-w-md rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Sett nytt passord</h1>

        {resetSuccess ? (
          <Alert type="success">Passordet ditt er endret! Du blir nå sendt til innloggingssiden.</Alert>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">Skriv inn ditt nye passord for å fullføre tilbakestillingen.</p>

            <form.AppField name="password">
              {(field) => <field.TextInput label="Nytt passord" type="password" />}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(field) => <field.TextInput label="Bekreft passord" type="password" />}
            </form.AppField>

            {isError && (
              <Alert type="critical">
                {error instanceof Error
                  ? error.message
                  : "Ugyldig eller utløpt tilbakestillingslenke. Prøv igjen eller be om en ny lenke."}
              </Alert>
            )}

            <form.AppForm>
              <form.SubmitButton disabled={isPending}>
                {isPending ? "Tilbakestiller..." : "Sett nytt passord"}
              </form.SubmitButton>
            </form.AppForm>

            <div className="text-center mt-4">
              <button
                onClick={() => router.push("/login")}
                className="text-blue-500 hover:underline text-sm hover:cursor-pointer">
                Tilbake til innlogging
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
