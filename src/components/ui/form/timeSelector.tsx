import { Time } from "@/types/time";
import { useFieldContext } from "@/util/formContext";

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
      field.handleChange((prev) => new Time(newHours, prev?.minutes ?? 0));
      return;
    }

    if (newHours > maxHours) {
      field.handleChange((prev) => new Time(maxHours, prev?.minutes ?? 0));
      return;
    }

    field.handleChange((prev) => new Time(newHours, prev?.minutes ?? 0));
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = event.target.value ? parseInt(event.target.value, 10) : 0;

    if (newMinutes < minMinutes) {
      field.handleChange((prev) => new Time(prev?.hours ?? 0, minMinutes));
      return;
    }

    if (newMinutes > maxMinutes) {
      field.handleChange((prev) => new Time(prev?.hours ?? 0, maxMinutes));
      return;
    }

    field.handleChange((prev) => new Time(prev?.hours ?? 0, newMinutes));
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        <label htmlFor="hours" className="sr-only">
          Hours
        </label>{" "}
        {/* Screen-reader-only label */}
        <input
          id="hours"
          type="text"
          value={field.state.value?.hours ?? 0}
          onChange={handleHoursChange}
          className="border rounded p-1 w-16"
          aria-label="Hours"
        />
        {":"}
        <label htmlFor="minutes" className="sr-only">
          Minutes
        </label>{" "}
        {/* Screen-reader-only label */}
        <input
          id="minutes"
          type="text"
          value={field.state.value?.minutes ?? 0}
          onChange={handleMinutesChange}
          className="border rounded p-1 w-16"
          aria-label="Minutes"
        />
      </div>
    </div>
  );
}
