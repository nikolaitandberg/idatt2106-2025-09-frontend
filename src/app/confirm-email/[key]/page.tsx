"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmEmailPage() {
  const { key } = useParams();
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!key || typeof key !== "string") return;

    const confirmEmail = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/confirm-email/${key}`, {
          method: "POST",
        });

        setSuccess(res.ok);
      } catch {
        setSuccess(false);
      }
    };

    confirmEmail();
  }, [key]);

  if (success === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Bekrefter e-post...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center text-center px-4">
      <div className="bg-white shadow rounded-2xl p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">{success ? "E-post bekreftet!" : "Bekreftelse feilet"}</h1>
        <p className="text-gray-600">
          {success
            ? "Din e-postadresse er nå bekreftet. Du kan lukke denne siden."
            : "Bekreftelseslenken er ugyldig eller utløpt."}
        </p>
      </div>
    </div>
  );
}
