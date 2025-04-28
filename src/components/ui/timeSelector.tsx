import { useState } from "react";

type Time = {
  hours: number;
  minutes: number;
};

interface TimeSelectorProps {
  initialValue?: Time;
  label?: string;
  onChange?: (time: Time) => void;
}

export default function TimeSelector({ initialValue, label, onChange }: TimeSelectorProps) {
  const [time, setTime] = useState<Time>({
    hours: initialValue?.hours ?? 0,
    minutes: initialValue?.minutes ?? 0,
  });

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = event.target.value ? parseInt(event.target.value, 10) : 0;
    if (newHours < 0 || newHours > 23) {
      setTime((prev) => ({ ...prev, hours: 23 }));
      return;
    }
    setTime((prev) => ({ ...prev, hours: newHours }));
    onChange?.({ ...time, hours: newHours });
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = event.target.value ? parseInt(event.target.value, 10) : 0;
    if (newMinutes < 0 || newMinutes > 59) {
      setTime((prev) => ({ ...prev, minutes: 59 }));
      return;
    }
    setTime((prev) => ({ ...prev, minutes: newMinutes }));
    onChange?.({ ...time, minutes: newMinutes });
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        <input type="text" value={time.hours} onChange={handleHoursChange} className="border rounded p-1 w-16" />
        {":"}
        <input type="text" value={time.minutes} onChange={handleMinutesChange} className="border rounded p-1 w-16" />
      </div>
    </div>
  );
}
