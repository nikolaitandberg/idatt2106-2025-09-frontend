"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { TopbarCard } from "@/components/ui/topbarCard";
import { GraduationCap, House, Users } from "lucide-react";
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

        <div className="grid grid-cols-4 md:flex md:relative md:gap-6 [&>*]:justify-self-center px-4 md:px-0 overflow-hidden bg-white w-full fixed bottom-0 left-0 items-center justify-center md:justify-end">
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
