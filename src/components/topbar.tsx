"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { TopbarCard } from "@/components/ui/topbarCard";
import { GraduationCap, House, MapPin, Users } from "lucide-react";
import { AdminMenuPopover } from "@/components/adminMenuPopover";
import { UserAvatarFromUserId } from "./ui/UserAvatar";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const session = useSession();
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between py-2 px-4 md:px-10">
        <Link href="/" className="text-2xl font-bold">
          <Image src="/logo.svg" alt="Logo" width={50} height={50} priority />
        </Link>

        <div className="grid grid-flow-col auto-cols-fr md:flex md:relative md:gap-6 [&>*]:justify-self-center [&>*]:flex-1 md:[&>*]:flex-none px-0 sm:px-8 md:px-0 overflow-hidden bg-white w-full fixed bottom-0 left-0 items-center md:justify-end">
          {session?.data?.user?.isAdmin && <AdminMenuPopover isSelected={pathname.startsWith("/admin")} />}
          {session?.status === "authenticated" && (
            <>
              <TopbarCard
                icon={House}
                text="Husholdning"
                href="/household"
                isSelected={pathname.startsWith("/household")}
              />
              <TopbarCard icon={Users} text="Gruppe" href="/group" isSelected={pathname.startsWith("/group")} />
            </>
          )}
          <TopbarCard
            icon={GraduationCap}
            text="Læring"
            href="/learning"
            isSelected={pathname.startsWith("/learning")}
          />
          <TopbarCard icon={MapPin} text="Kart" href="/map" isSelected={pathname.startsWith("/map")} />
        </div>
        <Link href="/profile" className="flex flex-row items-center ml-4">
          <UserAvatarFromUserId
            className="size-12 border-neutral-600 text-md stroke-[0.8]"
            userId={session?.data?.user?.userId ?? 0}
          />
        </Link>
      </div>
    </div>
  );
}
