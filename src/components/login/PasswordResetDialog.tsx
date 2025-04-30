"use client";

import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Alert from "@/components/ui/alert";
import { useRequestPasswordReset } from "@/actions/user";

export default function PasswordResetDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { mutate: resetPassword, isError, isPending, error, isSuccess } = useRequestPasswordReset();

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    resetPassword(email);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setEmail("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <button onClick={() => setOpen(true)} className="text-blue-500 hover:underline hover:cursor-pointer">
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
          <form onSubmit={handleResetPassword}>
            <p className="text-sm text-gray-500 mb-4">
              Skriv inn din e-postadresse for å motta en lenke for å tilbakestille passordet ditt.
            </p>

            <TextInput
              label="E-post"
              name="email"
              type="email"
              placeholder="din@epost.no"
              initialValue={email}
              onChange={setEmail}
              validate={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
              validationErrorMessage="Vennligst skriv inn en gyldig e-postadresse"
            />

            {isError && <Alert type="critical">{error.message}</Alert>}

            <DialogFooter className="mt-6">
              <Button type="submit" disabled={isPending}>
                {isPending ? <LoadingSpinner /> : "Send nullstillingslenke"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
