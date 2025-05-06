import { auth } from "@/util/auth";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    notFound();
  }

  return (
    <div className="flex h-full flex-1">
      <div className="flex-1/2 p-6">{children}</div>
    </div>
  );
}
