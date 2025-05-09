import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="border rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-muted rounded-full">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <Link href={href}>
            <Button variant="link" className="mt-2 px-0">
              Gå til {title.toLowerCase()}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
