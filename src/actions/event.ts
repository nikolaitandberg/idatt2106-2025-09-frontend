import { ApiError } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
import { MapBounds } from "@/types/map";
import { Event, Severity } from "@/types/event";
import Fetch, { FetchFunction, useFetch } from "@/util/fetch";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export type EventsResponse = Event[];
export type SeveritiesResponse = Severity[];

export interface CreateEventRequest {
  info_page_id?: number;
  latitude: number;
  longitude: number;
  radius: number;
  start_time: string;
  end_time?: string;
  severity_id: number;
  recomendation?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: number;
}

/**
 * Function to get events within the given bounds
 * @param bounds the bounds to get events for
 * @param fetcher the fetch function to use
 */
export const getEvents = async (bounds: MapBounds, fetcher: FetchFunction = Fetch): Promise<EventsResponse> => {
  const searchParams = new URLSearchParams({
    minLat: bounds.minLat.toString(),
    maxLat: bounds.maxLat.toString(),
    minLong: bounds.minLong.toString(),
    maxLong: bounds.maxLong.toString(),
  });

  try {
    const res = await fetcher<EventsResponse>(`${API_BASE_URL}/events/bounds?${searchParams.toString()}`);

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
 * Client side hook to get events
 * @param bounds the bounds to get events for
 */
export const useEvents = (bounds: MapBounds) => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["event", "events", bounds],
    queryFn: () => getEvents(bounds, fetcher),
    placeholderData: keepPreviousData,
  });
};

/**
 * Function to get severities
 * @param fetcher the fetch function to use
 */
export const getSeverities = async (fetcher: FetchFunction = Fetch): Promise<SeveritiesResponse> => {
  try {
    const res = await fetcher<SeveritiesResponse>(`${API_BASE_URL}/severity`);

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
 * Client side hook to get severities
 */
export const useSeverities = () => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["event", "severities"],
    queryFn: () => getSeverities(fetcher),
    placeholderData: keepPreviousData,
  });
};

/**
 * Function to create an event
 * @param req the event to create
 * @param fetcher the fetch function to use
 */
export const createEvent = async (req: CreateEventRequest, fetcher: FetchFunction = Fetch): Promise<null> => {
  return await fetcher<null>(`${API_BASE_URL}/event`, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Client side hook to create an event
 */
export const useCreateEvent = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (req: CreateEventRequest) => {
      return createEvent(req, fetcher);
    },
  });
};

/**
 * Function to update an event
 * @param req the event to update
 * @param fetcher the fetch function to use
 */
export const updateEvent = async (req: UpdateEventRequest, fetcher: FetchFunction = Fetch): Promise<null> => {
  return await fetcher<null>(`${API_BASE_URL}/event/update`, {
    method: "PUT",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Client side hook to update an event
 */
export const useUpdateEvent = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (req: UpdateEventRequest) => {
      return updateEvent(req, fetcher);
    },
  });
};

/**
 * Function to delete an event
 * @param id the id of the event to delete
 * @param fetcher the fetch function to use
 */
export const deleteEvent = async (id: number, fetcher: FetchFunction = Fetch): Promise<null> => {
  return await fetcher<null>(`${API_BASE_URL}/event/${id}`, {
    method: "DELETE",
  });
};

/**
 * Client side hook to delete an event
 */
export const useDeleteEvent = () => {
  const fetcher = useFetch();

  return useMutation({
    mutationFn: (id: number) => {
      return deleteEvent(id, fetcher);
    },
  });
};

/**
 * Function to get a single event by id
 * @param id the id of the event
 * @param fetcher the fetch function to use
 */
export const getEventById = async (id: number, fetcher: FetchFunction = Fetch): Promise<Event | null> => {
  try {
    return await fetcher<Event>(`${API_BASE_URL}/event/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.code === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Client side hook to get a single event by id
 */
export const useEvent = (id: number | undefined) => {
  const fetcher = useFetch();

  return useQuery({
    queryKey: ["event", id],
    queryFn: () => {
      if (!id) throw new Error("No event ID provided");
      return getEventById(id, fetcher);
    },
    enabled: !!id,
  });
};
