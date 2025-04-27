import { createMapObjectTypeRequest } from "@/types";
import { ApiError, MapObjectsResponse, MapObjectsTypesResponse } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
import { MapBounds, MapObjectType } from "@/types/map";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

/**
 * Function to get map objects within the given bounds
 * @param bounds the bounds to get map objects for
 * @param fetcher the fetch function to use
 */
export const getMapObjects = async (bounds: MapBounds, fetcher: FetchFunction = Fetch): Promise<MapObjectsResponse> => {
  const searchParams = new URLSearchParams({
    minLat: bounds.minLat.toString(),
    maxLat: bounds.maxLat.toString(),
    minLong: bounds.minLong.toString(),
    maxLong: bounds.maxLong.toString(),
  });

  try {
    const res = await fetcher<MapObjectsResponse>(`${API_BASE_URL}/map-object/bounds?${searchParams.toString()}`);

    if (!res) {
      return [];
    }
    return res;
  } catch (error) {
    if (error instanceof ApiError && error.code === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Client side hook to get map objects
 * @param bounds the bounds to get map objects for
 */
export const useMapObjects = (bounds: MapBounds) => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["map", "mapObjects", bounds],
    queryFn: () => getMapObjects(bounds, fetcher),
    placeholderData: keepPreviousData,
  });
};

/**
 * Function to get map object types
 * @param fetcher the fetch function to use
 */
export const getMapObjectTypes = async (fetcher: FetchFunction = Fetch): Promise<MapObjectsTypesResponse> => {
  try {
    const res = await fetcher<MapObjectsTypesResponse>(`${API_BASE_URL}/map-object-type`);

    if (!res) {
      return [];
    }
    return res;
  } catch (error) {
    if (error instanceof ApiError && error.code === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Client side hook to get map object types
 */
export const useMapObjectTypes = () => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["map", "mapObjectTypes"],
    queryFn: () => getMapObjectTypes(fetcher),
    placeholderData: keepPreviousData,
  });
};

/**
 * Function to edit a map object type
 * @param req the map object type to edit
 * @param fetcher the fetch function to use
 */
export const editMapObjectType = async (req: MapObjectType, fetcher: FetchFunction = Fetch): Promise<null> => {
  return await fetcher<null>(`${API_BASE_URL}/map-object-type/update`, {
    method: "PUT",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Client side hook to edit a map object type
 */
export const useMutateMapObjectType = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (req: MapObjectType) => editMapObjectType(req, fetcher),
  });
};

/**
 * Function to create a map object type
 * @param req the map object type to create
 * @param fetcher the fetch function to use
 */
export const createMapObjectType = async (
  req: createMapObjectTypeRequest,
  fetcher: FetchFunction = Fetch,
): Promise<null> => {
  return await fetcher<null>(`${API_BASE_URL}/map-object-type`, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Client side hook to create a map object type
 */
export const useCreateMapObjectType = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (req: createMapObjectTypeRequest) => {
      return createMapObjectType(req, fetcher);
    },
  });
};

/**
 * Function to delete a map object type
 */
export const deleteMapObjectType = async (id: number, fetcher: FetchFunction = Fetch): Promise<null> => {
  return await fetcher<null>(`${API_BASE_URL}/map-object-type/${id}`, {
    method: "DELETE",
  });
};

/**
 * Client side hook to delete a map object type
 */
export const useDeleteMapObjectType = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (id: number) => {
      return deleteMapObjectType(id, fetcher);
    },
  });
};
