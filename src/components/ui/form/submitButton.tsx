import { useFormContext } from "@/util/formContext";
import { Button, ButtonProps } from "../button";
import LoadingSpinner from "../loadingSpinner";

type SubmitButtonProps = ButtonProps;

export default function SubmitButton(props: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button {...props} disabled={!canSubmit} size="fullWidth" type="submit" onClick={(e) => form.handleSubmit(e)}>
          {isSubmitting ? <LoadingSpinner /> : props.children}
        </Button>
      )}
    </form.Subscribe>
  );
}
