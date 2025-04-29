import { useFieldContext } from "@/util/formContext";

type Time = {
  hours: number;
  minutes: number;
};

interface TimeSelectorProps {
  maxHours?: number;
  maxMinutes?: number;
  minHours?: number;
  minMinutes?: number;
  label?: string;
}

export default function TimeSelector({
  label,
  maxHours = 23,
  maxMinutes = 59,
  minHours = 0,
  minMinutes = 0,
}: TimeSelectorProps) {
  const field = useFieldContext<Time>();

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = event.target.value ? parseInt(event.target.value, 10) : 0;

    if (newHours < minHours) {
      field.handleChange((prev) => ({ ...prev, hours: minHours }));
      return;
    }

    if (newHours > maxHours) {
      field.handleChange((prev) => ({ ...prev, hours: maxHours }));
      return;
    }

    field.handleChange((prev) => ({ ...prev, hours: newHours }));
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = event.target.value ? parseInt(event.target.value, 10) : 0;

    if (newMinutes < minMinutes) {
      field.handleChange((prev) => ({ ...prev, minutes: minMinutes }));
      return;
    }

    if (newMinutes > maxMinutes) {
      field.handleChange((prev) => ({ ...prev, minutes: maxMinutes }));
      return;
    }

    field.handleChange((prev) => ({ ...prev, minutes: newMinutes }));
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        <input
          type="text"
          value={field.state.value.hours}
          onChange={handleHoursChange}
          className="border rounded p-1 w-16"
        />
        {":"}
        <input
          type="text"
          value={field.state.value.minutes}
          onChange={handleMinutesChange}
          className="border rounded p-1 w-16"
        />
      </div>
    </div>
  );
}
