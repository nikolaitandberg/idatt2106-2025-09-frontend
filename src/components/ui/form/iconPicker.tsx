import { mapIcons } from "@/util/icons";
import ComboBox from "../comboBox";
import { useFieldContext } from "@/util/formContext";

const iconList = Object.keys(mapIcons).map((icon) => ({
  name: icon,
  icon: mapIcons[icon as keyof typeof mapIcons],
}));

export default function IconPicker() {
  const field = useFieldContext<keyof typeof mapIcons>();

  return (
    <div>
      <div className="block text-m font-medium mb-1">Velg ikon</div>
      <ComboBox
        options={iconList}
        value={iconList.find((icon) => icon.name === field.state.value) ?? undefined}
        placeholder="velg ikon"
        renderOption={RenderIcon}
        renderSelected={RenderIcon}
        onSelect={(option) => {
          field.handleChange(option.name as keyof typeof mapIcons);
        }}
      />
    </div>
  );
}

function RenderIcon(item: (typeof iconList)[number]) {
  return (
    <div className="flex items-center">
      <item.icon className="w-5 h-5 mr-2" />
      <span>{item.name}</span>
    </div>
  );
}
