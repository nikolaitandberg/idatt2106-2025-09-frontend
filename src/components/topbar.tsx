"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { TopbarCard } from "@/components/ui/topbarCard";
import { CircleUserRound, ShieldUser, GraduationCap, House, Users } from "lucide-react"; // or any icon library you prefer

export default function Topbar() {
  const session = useSession();

  return (
    <div className="flex items-center justify-between bg-white py-2 px-10 shadow-md">
      <Link href="/" className="text-2xl font-bold">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} priority />
      </Link>
      <div className="flex items-center justify-end w-1/3">
        {session?.data?.user?.isAdmin && <TopbarCard icon={ShieldUser} text="Admin" href="/admin" />}
        <TopbarCard icon={GraduationCap} text="Læring" href="/learning" />
        {session?.status === "authenticated" ? (
          <>
            <TopbarCard icon={House} text="Husholdning" href="/household" />
            <TopbarCard icon={Users} text="Beredskapsgruppe" href="/group" />
            <Link href="/profile" className="flex flex-row items-center ml-20">
              <CircleUserRound size={50} strokeWidth={1} />
            </Link>
          </>
        ) : (
          <Link href="/login" className="flex flex-row items-center ml-20">
            <CircleUserRound size={50} strokeWidth={1} />
          </Link>
        )}
      </div>
    </div>
  );
}
