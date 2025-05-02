import { cn } from "@/util/cn";

interface FormSectionProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  description?: string;
  dividerTop?: boolean;
}

export default function FormSection({ title, className, children, description, dividerTop }: FormSectionProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {dividerTop && <hr className="border-t border-gray-300 dark:border-gray-700" />}
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
