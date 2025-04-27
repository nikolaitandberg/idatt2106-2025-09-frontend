import { mapIcons } from "@/util/icons";
import ComboBox from "./comboBox";

export default function IconPicker() {
  const iconList = Object.keys(mapIcons).map((icon) => ({
    name: icon,
    icon: mapIcons[icon as keyof typeof mapIcons],
  }));

  function RenderIcon(item: (typeof iconList)[number]) {
    return (
      <div className="flex items-center">
        <item.icon className="w-5 h-5 mr-2" />
        <span>{item.name}</span>
      </div>
    );
  }
  return (
    <ComboBox
      options={iconList}
      placeholder="velg ikon"
      renderOption={RenderIcon}
      renderSelected={RenderIcon}
      onSelect={(item) => console.log(item)}
    />
  );
}
