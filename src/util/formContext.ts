import NumberInput from "@/components/ui/form/numberInput";
import TextInput from "@/components/ui/form/textInput";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
    NumberInput,
  },
  formComponents: {},
});

export default useAppForm;
