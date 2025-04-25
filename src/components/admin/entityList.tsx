"use client";

  import { useState } from "react";
  import { PlusCircle, X } from "lucide-react";
  import { EntityListItem } from "@/components/admin/entityListItem";

  interface Entity {
    id: string;
    [key: string]: any;
  }

  interface EntityListProps<T extends Entity> {
    entities: T[];
    entityType: string;
    displayFields: { key: keyof T; label: string }[];
    onView?: (entity: T) => void;
    onEdit?: (updatedEntity: T) => void;
    onDelete?: (entity: T) => void;
    onAdd?: () => void;
    renderAddForm?: () => React.ReactNode;
  }

  export function EntityList<T extends Entity>({
    entities,
    entityType,
    displayFields,
    onView,
    onEdit,
    onDelete,
    onAdd,
    renderAddForm,
  }: EntityListProps<T>) {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-medium">{entityType} List</h2>
          {onAdd || renderAddForm && (
            <button
              onClick={() => {
                if (renderAddForm) {
                  setShowAddForm(!showAddForm);
                } else if (onAdd) {
                  onAdd();
                }
              }}
              className="flex items-center text-sm px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <PlusCircle size={16} className="mr-1.5" />
              {showAddForm ? `Cancel` : `Add ${entityType}`}
            </button>
          )}
        </div>

        {showAddForm && renderAddForm && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Add New {entityType}</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            {renderAddForm()}
          </div>
        )}

        <div className="p-4">
          {entities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {entityType.toLowerCase()}s found. Add one to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {entities.map((entity) => (
                <EntityListItem
                  key={entity.id}
                  entity={entity}
                  displayFields={displayFields}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }