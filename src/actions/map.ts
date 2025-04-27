import { createMapObjectTypeRequest } from "@/types";
import { ApiError, MapObjectsResponse, MapObjectsTypesResponse } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
import { MapBounds, MapObjectType } from "@/types/map";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

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

export const useMapObjects = (bounds: MapBounds) => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["map", "mapObjects", bounds],
    queryFn: () => getMapObjects(bounds, fetcher),
    placeholderData: keepPreviousData,
  });
};

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

export const useMapObjectTypes = () => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["map", "mapObjectTypes"],
    queryFn: () => getMapObjectTypes(fetcher),
    placeholderData: keepPreviousData,
  });
};

export const editMapObjectType = async (req: MapObjectType, fetcher: FetchFunction = Fetch): Promise<null> => {
  return await fetcher<null>(`${API_BASE_URL}/map-object-type/update`, {
    method: "PUT",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const useMutateMapObjectType = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (req: MapObjectType) => editMapObjectType(req, fetcher),
  });
};

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

export const useCreateMapObjectType = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (req: createMapObjectTypeRequest) => {
      return createMapObjectType(req, fetcher);
    },
  });
};

export const deleteMapObjectType = async (id: number, fetcher: FetchFunction = Fetch): Promise<null> => {
  return await fetcher<null>(`${API_BASE_URL}/map-object-type/${id}`, {
    method: "DELETE",
  });
};

export const useDeleteMapObjectType = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (id: number) => {
      return deleteMapObjectType(id, fetcher);
    },
  });
};
