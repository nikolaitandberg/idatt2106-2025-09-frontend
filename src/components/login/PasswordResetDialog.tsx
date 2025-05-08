"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { useRequestPasswordReset } from "@/actions/user";
import { z } from "zod";
import useAppForm from "@/util/formContext";

export default function PasswordResetDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: resetPassword, isError, error, isSuccess } = useRequestPasswordReset();

  const schema = z.object({
    email: z.string().email({ message: "Ugyldig epost" }),
  });

  const handleClose = () => {
    setOpen(false);
  };

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        resetPassword(value.email, {
          onSettled: resolve,
        });
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <button onClick={() => setOpen(true)} className="text-blue-700 hover:underline hover:cursor-pointer">
        Tilbakestill passord
      </button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tilbakestill passord</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <>
            <Alert type="success">
              En e-post med instruksjoner for å tilbakestille passordet er sendt. Sjekk innboksen din (og eventuelt
              spam-mappen).
            </Alert>
            <DialogFooter>
              <Button onClick={handleClose}>Lukk</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Skriv inn din e-postadresse for å motta en lenke for å tilbakestille passordet ditt.
            </p>

            <form.AppField name="email">{(field) => <field.TextInput label="Epost" />}</form.AppField>

            {isError && <Alert type="critical">{error.message}</Alert>}

            <DialogFooter className="mt-6">
              <form.AppForm>
                <form.SubmitButton>Send tilbakestillinslenke</form.SubmitButton>
              </form.AppForm>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
