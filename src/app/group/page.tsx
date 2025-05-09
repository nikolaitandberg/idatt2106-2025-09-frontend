import { getMyGroupMemberships } from "@/actions/group";
import CreateOrJoinGroupForm from "@/components/group/createJoinGroupForm";
import GroupInvites from "@/components/group/groupInvites";
import UserGroupList from "@/components/group/userGroupList";
import CreateGroupDialogOpenWrapper from "@/components/group/createGroupDialogWrapper";
import { auth } from "@/util/auth";
import { redirect } from "next/navigation";

export default async function UserGroupsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  const relations = await getMyGroupMemberships().catch(() => null);

  if (!relations || relations.length === 0) {
    return <CreateOrJoinGroupForm />;
  }

  return (
    <div className="flex flex-1 md:flex-row flex-col bg-background text-foreground">
      <main className="md:flex-1 px-4 py-8 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-0 gap-4">
          <h1 className="text-2xl font-semibold">Dine beredskapsgrupper</h1>
          <div className="sm:ml-auto">
            <CreateGroupDialogOpenWrapper />
          </div>
        </div>

        <UserGroupList />
      </main>

      <aside className="w-full md:w-2/6 md:bg-white border-l border-border p-4 space-y-8">
        <h2 className="text-xl font-semibold mb-4">Gruppeinvitasjoner</h2>
        <GroupInvites />
      </aside>
    </div>
  );
}
