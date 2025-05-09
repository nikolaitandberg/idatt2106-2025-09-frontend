"use client";
import { useProfile, useUpdateUserPositionSharing, useSendEmailVerification } from "@/actions/user";
import { useMyHousehold } from "@/actions/household";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Switch } from "@/components/ui/Switch";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { EditUserProfileForm } from "@/components/profile/editUserProfileForm";
import { UserAvatarFromUserId } from "@/components/ui/UserAvatar";
import { showToast } from "@/components/ui/toaster";

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
  const { data: household } = useMyHousehold();
  const { mutate: updateUserPositionSharing } = useUpdateUserPositionSharing();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { mutate: sendEmailVerification, isPending: isSendingEmail } = useSendEmailVerification();
  const [verificationSent, setVerificationSent] = useState(false);

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
        <h2 className="text-xl font-bold text-red-700">Kunne ikke laste profilen din</h2>
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

  const handlePositionSharingChange = ({
    sharePositionHousehold,
    sharePositionGroup,
  }: {
    sharePositionHousehold: boolean;
    sharePositionGroup: boolean;
  }) => {
    updateUserPositionSharing({
      userId: profile.id,
      sharePositionHousehold,
      sharePositionGroup,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-[calc(100vh-7rem)]">
      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <UserAvatarFromUserId
            userId={profile.id}
            className="w-24 h-24 md:w-32 md:h-32 text-3xl stroke-1 md:stroke-[0.5]"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold" data-testid="profile-name">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-500 mt-1" data-testid="profile-username">
              @{profile.username}
            </p>
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
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">E-post</p>
                {profile.emailConfirmed ? (
                  <Button disabled className="h-6 pointer-events-none ml-2">
                    Verifisert
                  </Button>
                ) : (
                  <Button
                    className="h-6 ml-2 min-w-[120px]"
                    disabled={isSendingEmail || verificationSent}
                    onClick={() => {
                      sendEmailVerification(undefined, {
                        onSuccess: () => {
                          setVerificationSent(true);
                          showToast({
                            variant: "success",
                            title: "E-post sendt",
                            description: `Verifiseringslenken er sendt til ${profile.email}.`,
                          });
                        },
                        onError: () => {
                          showToast({
                            variant: "error",
                            title: "Feil",
                            description: "Kunne ikke sende verifiserings-e-posten.",
                          });
                        },
                      });
                    }}>
                    {verificationSent ? "Sendt" : isSendingEmail ? "Sender..." : "Verifiser e-post"}
                  </Button>
                )}
              </div>
              <p className="font-medium mt-1" data-testid="profile-email">
                {profile.email}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Husholdning</p>
              <p className="font-medium" data-testid="profile-household-address">
                {household?.address || "Ingen"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Posisjonsdeling</p>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Switch
                  aria-label="Del posisjon med husholdning"
                  id="sharePositionHousehold"
                  name="sharePositionHousehold"
                  data-testid="profile-share-position-household"
                  checked={profile.sharePositionHousehold}
                  onCheckedChange={(checked) => {
                    handlePositionSharingChange({
                      sharePositionHousehold: checked,
                      sharePositionGroup: profile.sharePositionGroup,
                    });
                  }}
                />
                <label
                  htmlFor="sharePositionHousehold"
                  className="cursor-pointer select-none"
                  onClick={() =>
                    handlePositionSharingChange({
                      sharePositionHousehold: !profile.sharePositionHousehold,
                      sharePositionGroup: profile.sharePositionGroup,
                    })
                  }>
                  Husholdning
                </label>
                <span
                  className={`w-3 h-3 rounded-full ${profile.sharePositionHousehold ? "bg-green-600" : "bg-red-600"}`}></span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  aria-label="Del posisjon med gruppe"
                  id="sharePositionGroup"
                  name="sharePositionGroup"
                  data-testid="profile-share-position-group"
                  checked={profile.sharePositionGroup}
                  onCheckedChange={(checked) => {
                    handlePositionSharingChange({
                      sharePositionHousehold: profile.sharePositionHousehold,
                      sharePositionGroup: checked,
                    });
                  }}
                />
                <label
                  htmlFor="sharePositionGroup"
                  className="cursor-pointer select-none"
                  onClick={() =>
                    handlePositionSharingChange({
                      sharePositionHousehold: profile.sharePositionHousehold,
                      sharePositionGroup: !profile.sharePositionGroup,
                    })
                  }>
                  Gruppe
                </label>
                <span
                  className={`w-3 h-3 rounded-full ${profile.sharePositionGroup ? "bg-green-600" : "bg-red-600"}`}></span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button onClick={() => setEditDialogOpen(true)} variant="outline" data-testid="profile-edit-button">
            Rediger profil
          </Button>
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
        {profile && (
          <EditUserProfileForm open={editDialogOpen} onClose={() => setEditDialogOpen(false)} user={profile} />
        )}
      </div>
    </div>
  );
}
