import NumberInput from "@/components/ui/form/numberInput";
import SubmitButton from "@/components/ui/form/submitButton";
import TextInput from "@/components/ui/form/textInput";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
    NumberInput,
  },
  formComponents: {
    SubmitButton,
  },
});

export default useAppForm;
