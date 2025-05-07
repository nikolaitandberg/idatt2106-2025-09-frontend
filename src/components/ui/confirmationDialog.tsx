import { cn } from "@/util/cn";
import Alert from "./alert";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import LoadingSpinner from "./loadingSpinner";

interface ConfirmationDialogProps {
  variant?: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  confirmIsPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  variant = "info",
  title,
  description,
  confirmText = "OK",
  cancelText = "Avbryt",
  open = true,
  confirmIsPending,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <Alert type={variant}>{description}</Alert>
        <div className="flex justify-between gap-2 mt-4">
          <Button
            size="fullWidth"
            variant="outline"
            className="px-4 py-2"
            onClick={() => {
              onCancel();
            }}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "critical" ? "destructive" : "default"}
            size="fullWidth"
            className={cn("px-4 py-2")}
            onClick={() => {
              onConfirm();
            }}>
            {confirmIsPending ? <LoadingSpinner /> : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
