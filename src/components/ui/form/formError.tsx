import { cn } from "@/util/cn";

interface FormErrorProps {
  className?: string;
  error?: string;
}

export default function FormError({ className, error }: FormErrorProps) {
  return <div className={cn("text-red-500 text-center", className)}>{error}</div>;
}
