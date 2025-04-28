import { mapIcons } from "@/util/icons";

interface IconProps {
  icon: keyof typeof mapIcons;
  className?: string;
  size?: number;
}

export default function Icon({ icon, className, size }: IconProps) {
  const IconComponent = mapIcons[icon];
  return <IconComponent className={className} size={size} />;
}
