import { Dog } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
  name: string;
  image?: string;
  type?: "person" | "animal" | "child";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function AvatarContent({ name, image, type }: Readonly<UserAvatarProps>) {
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
    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground overflow-hidden">
      <AvatarContent {...props} />
    </div>
  );
}
