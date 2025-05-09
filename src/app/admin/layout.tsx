import { auth } from "@/util/auth";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  if (!(session?.user.isAdmin || session?.user.isSuperAdmin)) {
    notFound();
  }

  return (
    <div className="flex h-full flex-1 min-w-10/12 mx-auto p-4">
      <div className="flex-1/2 p-6">{children}</div>
    </div>
  );
}
