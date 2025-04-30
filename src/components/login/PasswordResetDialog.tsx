"use client";

import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import TextInput from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Alert from "@/components/ui/alert";

export default function PasswordResetDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setIsResetting(true);
    setError(null);

    try {
      // TODO: Må sette inn api-kall her


      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError("Kunne ikke sende e-post for nullstilling. Prøv igjen senere.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setEmail("");
      }, 300);
    }
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

        {success ? (
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

            {error && <Alert type="critical">{error}</Alert>}

            <DialogFooter className="mt-6">
              <Button type="submit" disabled={isResetting}>
                {isResetting ? <LoadingSpinner /> : "Send nullstillingslenke"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
