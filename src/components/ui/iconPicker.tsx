import { mapIcons } from "@/util/icons";
import ComboBox from "./comboBox";

interface IconPickerProps {
  initialValue?: string | null;
  onSelect?: (icon: keyof typeof mapIcons) => void;
}

const iconList = Object.keys(mapIcons).map((icon) => ({
  name: icon,
  icon: mapIcons[icon as keyof typeof mapIcons],
}));

export default function IconPicker({ initialValue, onSelect }: IconPickerProps) {
  function RenderIcon(item: (typeof iconList)[number]) {
    return (
      <div className="flex items-center">
        <item.icon className="w-5 h-5 mr-2" />
        <span>{item.name}</span>
      </div>
    );
  }
  return (
    <div>
      <div className="block text-m font-medium mb-1">Velg ikon</div>
      <ComboBox
        options={iconList}
        initialValue={initialValue ? iconList.find((icon) => icon.name === initialValue) : undefined}
        placeholder="velg ikon"
        renderOption={RenderIcon}
        renderSelected={RenderIcon}
        onSelect={(option) => {
          onSelect?.(option.name as keyof typeof mapIcons);
        }}
      />
    </div>
  );
}
