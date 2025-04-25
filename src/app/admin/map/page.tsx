"use client";

import { useState } from "react";
import { EntityList } from "@/components/admin/entityList";
import TextInput from "@/components/ui/textinput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MapObjectType {
  id: string;
  name: string;
  icon: string;
}

interface MapObject {
  id: string;
  name: string;
  typeId: string;
  latitude: string;
  longitude: string;
}

export default function AdminMap() {
  // Mock data - replace with actual data fetching
  const [mapObjectTypes, setMapObjectTypes] = useState<MapObjectType[]>([
    { id: "1", name: "Hospital", icon: "hospital" },
    { id: "2", name: "School", icon: "school" },
  ]);

  const [mapObjects, setMapObjects] = useState<MapObject[]>([
    { id: "1", name: "City Hospital", typeId: "1", latitude: "59.913868", longitude: "10.752245" },
    { id: "2", name: "Central School", typeId: "2", latitude: "59.924868", longitude: "10.762245" },
  ]);

  // Map object types handlers
  const handleEditType = (updatedEntity: MapObjectType) => {
    setMapObjectTypes(mapObjectTypes.map((item) => (item.id === updatedEntity.id ? updatedEntity : item)));
    // Call your API to update the entity
  };

  const handleDeleteType = (entity: MapObjectType) => {
    setMapObjectTypes(mapObjectTypes.filter((item) => item.id !== entity.id));
    // Call your API to delete the entity
  };

  const handleAddType = (name: string, icon: string) => {
    const newType = {
      id: Date.now().toString(),
      name,
      icon,
    };
    setMapObjectTypes([...mapObjectTypes, newType]);
    // Call your API to add the entity
  };

  // Map objects handlers
  const handleEditObject = (updatedEntity: MapObject) => {
    setMapObjects(mapObjects.map((item) => (item.id === updatedEntity.id ? updatedEntity : item)));
    // Call your API to update the entity
  };

  const handleDeleteObject = (entity: MapObject) => {
    setMapObjects(mapObjects.filter((item) => item.id !== entity.id));
    // Call your API to delete the entity
  };

  const handleAddObject = (name: string, typeId: string, latitude: string, longitude: string) => {
    const newObject = {
      id: Date.now().toString(),
      name,
      typeId,
      latitude,
      longitude,
    };
    setMapObjects([...mapObjects, newObject]);
    // Call your API to add the entity
  };

  // Enhanced display for map objects to show type name instead of just ID
  const getTypeNameById = (typeId: string) => {
    const type = mapObjectTypes.find((t) => t.id === typeId);
    return type ? type.name : "Unknown Type";
  };

  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeIcon, setNewTypeIcon] = useState("");

  const [newObjectName, setNewObjectName] = useState("");
  const [newObjectTypeId, setNewObjectTypeId] = useState("");
  const [newObjectLatitude, setNewObjectLatitude] = useState("");
  const [newObjectLongitude, setNewObjectLongitude] = useState("");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Map Management</h1>

      <div className="w-1/2">
        <Tabs defaultValue="types" className="w-full mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="types">Map Object Types</TabsTrigger>
            <TabsTrigger value="objects">Map Objects</TabsTrigger>
          </TabsList>

          <TabsContent value="types">
            <EntityList
              entities={mapObjectTypes}
              entityType="Map Object Type"
              displayFields={[
                { key: "name", label: "Name" },
                { key: "icon", label: "Icon" },
              ]}
              onEdit={handleEditType}
              onDelete={handleDeleteType}
              renderAddForm={() => (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                      label="Name"
                      name="name"
                      placeholder="Type name..."
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                    />
                    <TextInput
                      label="Icon"
                      name="icon"
                      placeholder="Icon name..."
                      value={newTypeIcon}
                      onChange={(e) => setNewTypeIcon(e.target.value)}
                    />
                  </div>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-md"
                    onClick={() => {
                      handleAddType(newTypeName, newTypeIcon);
                      setNewTypeName("");
                      setNewTypeIcon("");
                    }}>
                    Add Map Object Type
                  </button>
                </div>
              )}
            />
          </TabsContent>

          <TabsContent value="objects">
            <EntityList
              entities={mapObjects}
              entityType="Map Object"
              displayFields={[
                { key: "name", label: "Name" },
                { key: "typeId", label: "Type", formatter: getTypeNameById },
                { key: "latitude", label: "Latitude" },
                { key: "longitude", label: "Longitude" },
              ]}
              onEdit={handleEditObject}
              onDelete={handleDeleteObject}
              renderAddForm={() => (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                      label="Name"
                      name="objectName"
                      placeholder="Object name..."
                      value={newObjectName}
                      onChange={(e) => setNewObjectName(e.target.value)}
                    />
                    <div className="mb-4">
                      <label className="block text-m font-medium mb-1">Object Type</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newObjectTypeId}
                        onChange={(e) => setNewObjectTypeId(e.target.value)}>
                        <option value="">Select a type...</option>
                        {mapObjectTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <TextInput
                      label="Latitude"
                      name="latitude"
                      placeholder="Latitude..."
                      value={newObjectLatitude}
                      onChange={(e) => setNewObjectLatitude(e.target.value)}
                    />
                    <TextInput
                      label="Longitude"
                      name="longitude"
                      placeholder="Longitude..."
                      value={newObjectLongitude}
                      onChange={(e) => setNewObjectLongitude(e.target.value)}
                    />
                  </div>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-md"
                    onClick={() => {
                      handleAddObject(newObjectName, newObjectTypeId, newObjectLatitude, newObjectLongitude);
                      setNewObjectName("");
                      setNewObjectTypeId("");
                      setNewObjectLatitude("");
                      setNewObjectLongitude("");
                    }}>
                    Add Map Object
                  </button>
                </div>
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
