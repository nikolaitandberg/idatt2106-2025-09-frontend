import { ApiError, MapObjectsResponse } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
import { MapBounds } from "@/types/map";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
