import { Button } from "../ui/button";
import GroupCard from "../ui/groupCard";

export default function HouseholdGroups() {
  return (
    <div className="space-y-4">
      <h2 className="font-medium">Grupper</h2>
      <div className="grid grid-cols-2 gap-4">
        <GroupCard name="Gruppe 1" households={5} members={100} />
        <GroupCard name="Gruppe 2" households={2} members={3} />
      </div>
      <Button variant="default" className="w-full">
        Lag ny gruppe
      </Button>
    </div>
  );
}
