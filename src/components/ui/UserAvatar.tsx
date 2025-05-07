import { useProfile } from "@/actions/user";
import { cn } from "@/util/cn";
import { CircleUserRound, Dog } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
  name: string;
  image?: string;
  type?: "person" | "animal" | "child";
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function AvatarContent({ name, image, type }: Readonly<Omit<UserAvatarProps, "className">>) {
  if (image) {
    return <Image src={image} alt={name} width={40} height={40} className="object-cover w-full h-full rounded-full" />;
  } else if (type === "animal") {
    return <Dog className="w-4 h-4 text-foreground" />;
  } else {
    return getInitials(name);
  }
}

export default function UserAvatar(props: Readonly<UserAvatarProps>) {
  return (
    <div
      className={cn(
        "w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground overflow-hidden",
        props.className,
      )}>
      <AvatarContent {...props} />
    </div>
  );
}

export function UserAvatarFromUserId({ userId, className }: { userId: number; className?: string }) {
  const { data: user, isPending } = useProfile(userId);
  if (!user || isPending) {
    return <CircleUserRound className={className} />;
  }

  return <UserAvatar name={`${user.firstName} ${user.lastName}`} type="person" className={cn("w-8 h-8", className)} />;
}
