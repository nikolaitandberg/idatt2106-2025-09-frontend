"use client";

import { useState } from "react";
import { Pencil, Trash, Eye, X, Check } from "lucide-react";
import TextInput from "@/components/ui/textinput";

interface Entity {
  id: string;
  [key: string]: never;
}

interface EntityListItemProps<T extends Entity> {
  entity: T;
  displayFields: {
    key: keyof T;
    label: string;
    formatter?: (value: any) => string;
  }[];
  onView?: (entity: T) => void;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
}

export function EntityListItem<T extends Entity>({
  entity,
  displayFields,
  onView,
  onEdit,
  onDelete,
}: EntityListItemProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntity, setEditedEntity] = useState<T>({ ...entity });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedEntity({ ...entity });
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(editedEntity);
    }
  };

  const handleFieldChange = (key: keyof T, value: any) => {
    setEditedEntity({ ...editedEntity, [key]: value });
  };

  return (
    <div className="border rounded-md p-4 mb-2 hover:bg-gray-50">
      {isEditing ? (
        <div className="space-y-3">
          {displayFields.map(({ key, label }) => (
            <div key={key.toString()} className="flex flex-col">
              <div className="w-full">
                <TextInput
                  label={label}
                  name={key.toString()}
                  placeholder={label}
                  value={editedEntity[key]?.toString() || ""}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={handleCancelEdit}
              className="flex items-center px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
              <X size={16} className="mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex items-center px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">
              <Check size={16} className="mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div>
              {displayFields.map(({ key, label }) => (
                <div key={key.toString()} className="mb-1">
                  <span className="font-medium">{label}: </span>
                  <span>{entity[key]?.toString()}</span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 self-start">
              {onView && (
                <button
                  onClick={() => onView(entity)}
                  className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                  title="View">
                  <Eye size={18} />
                </button>
              )}
              {onEdit && (
                <button onClick={handleEditClick} className="p-1 text-amber-500 hover:bg-amber-50 rounded" title="Edit">
                  <Pencil size={18} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(entity)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Delete">
                  <Trash size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
