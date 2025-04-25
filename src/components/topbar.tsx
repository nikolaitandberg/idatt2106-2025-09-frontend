"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const auth = useSession();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md">
      <Link href="/" className="text-2xl font-bold">
        Hjem
      </Link>
      <div className="flex items-center space-x-4">
        {auth.status === "authenticated" && (
          <div className="text-gray-700">
            <span>Brukernavn: {auth.data?.sub}</span>
          </div>
        )}
        {auth.status !== "authenticated" ? (
          <Link href="/login" className="text-gray-700 hover:text-gray-900">
            Logg inn
          </Link>
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              signOut({ redirect: false });
              router.push("/login");
            }}>
            Logg ut
          </Button>
        )}
      </div>
    </div>
  );
}
