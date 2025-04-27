import { AdminMenu } from "@/components/adminMenu";
import { auth } from "@/util/auth";
import { notFound } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  console.log("session", session);

  if (!session) {
    notFound();
  }

  return (
    <div className="flex h-full flex-1">
      <div className="min-w-fit">
        <AdminMenu />
      </div>
      <div className="flex-1/2 p-6">{children}</div>
    </div>
  );
}
