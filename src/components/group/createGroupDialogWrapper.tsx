"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import CreateGroupDialog from "./createGroupDialog";

export default function CreateGroupDialogOpenWrapper() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>
        Opprett ny gruppe
        <Plus className="w-4 h-4 ml-2" />
      </Button>
      <CreateGroupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
