"use client";
import { useProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function ProfilePageWrapper() {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (session.status === "unauthenticated" || !session.data) {
    redirect("/login");
  }

  return <ProfilePage userId={session.data.user?.userId} />;
}

function ProfilePage({ userId }: { userId: number }) {
  const { data: profile, isLoading, error } = useProfile(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Kunne ikke laste profilen din</h2>
        <Button
          className="mt-4"
          onClick={() =>
            signOut({
              callbackUrl: "/login",
              redirect: true,
            })
          }
          variant="destructive">
          Logg ut
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
            {profile.picture ? (
              <Image
                src={profile.picture}
                alt={`${profile.firstName} ${profile.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                <span className="text-4xl text-gray-500">
                  {profile.firstName?.[0]}
                  {profile.lastName?.[0]}
                </span>
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-500 mt-1">@{profile.username}</p>
            {profile.admin && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2 mr-2">Admin</span>
            )}
            {profile.superAdmin && (
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mt-2">
                Super Admin
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">E-post</p>
              <p className="font-medium">{profile.email}</p>
              <span className={`text-xs ${profile.emailConfirmed ? "text-green-600" : "text-amber-600"}`}>
                {profile.emailConfirmed ? "Verifisert" : "Ikke verifisert"}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Husholdnings-ID</p>
              <p className="font-medium">{profile.householdId || "Ingen"}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Posisjonsdeling</p>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${profile.sharePositionHousehold ? "bg-green-500" : "bg-red-500"}`}></span>
                <span>Husholdning: {profile.sharePositionHousehold ? "På" : "Av"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${profile.sharePositionGroup ? "bg-green-500" : "bg-red-500"}`}></span>
                <span>Gruppe: {profile.sharePositionGroup ? "På" : "Av"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={() =>
              signOut({
                callbackUrl: "/login",
                redirect: true,
              })
            }
            variant="destructive">
            Logg ut
          </Button>
        </div>
      </div>
    </div>
  );
}
