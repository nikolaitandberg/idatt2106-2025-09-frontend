import { AdminMenu } from "@/components/adminMenu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <div className="min-w-fit min-h-screen">
        <AdminMenu />
      </div>
      <div className="flex-1/2 p-6">{children}</div>
    </div>
  );
}
