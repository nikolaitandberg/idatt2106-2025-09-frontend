import IconPicker from "@/components/ui/form/iconPicker";
import NumberInput from "@/components/ui/form/numberInput";
import SubmitButton from "@/components/ui/form/submitButton";
import TextInput from "@/components/ui/form/textInput";
import TextArea from "@/components/ui/form/textArea";
import PositionSelector from "@/components/ui/form/positionSelector";
import TimeSelector from "@/components/ui/form/timeSelector";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import FormCombBox from "@/components/ui/form/formComboBox";
import DatePicker from "@/components/ui/form/datePicker";
import FoodTypePicker from "@/components/ui/form/foodTypePicker";

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
    TextArea,
    NumberInput,
    IconPicker,
    TimeSelector,
    PositionSelector,
    ComboBox: FormCombBox,
    DatePicker,
    FoodTypePicker,
  },
  formComponents: {
    SubmitButton,
  },
});

export default useAppForm;
