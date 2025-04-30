import { useFieldContext } from "@/util/formContext";
import ComboBox from "../comboBox";
import { cn } from "@/util/cn";

interface FormCombBoxProps<T> {
  placeholder?: string;
  options: T[];
  label?: string;
  className?: string;
  errorClassName?: string;
  labelClassName?: string;
  renderOption: (option: T) => React.ReactNode;
  renderSelected: (option: T) => React.ReactNode;
}

export default function FormCombBox<T>({
  placeholder,
  options,
  label,
  className,
  errorClassName,
  labelClassName,
  renderOption,
  renderSelected,
}: Readonly<FormCombBoxProps<T>>) {
  const field = useFieldContext<T>();

  return (
    <div className={className}>
      <label className={cn("block text-m font-medium mb-1", labelClassName)}>{label}</label>
      <ComboBox
        placeholder={placeholder}
        options={options}
        value={field.state.value}
        onSelect={(option) => {
          field.handleChange(option);
        }}
        renderOption={(option) => renderOption(option)}
        renderSelected={(option) => renderSelected(option)}
      />
      <div className={cn("min-h-5 mt-1 text-red-500 text-sm [&>*]:not-last:mr-2", errorClassName)}>
        {field.state.meta.errors.length > 0 &&
          field.state.meta.errors.map((error) => <span key={error.validation + error.message}>{error.message}</span>)}
      </div>
    </div>
  );
}
