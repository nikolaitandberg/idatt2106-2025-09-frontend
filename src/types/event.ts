export type Event = {
  name?: string;
  id: number;
  infoPageId?: number;
  latitude: number;
  longitude: number;
  radius: number;
  startTime: string;
  endTime?: string;
  severityId: number;
  colour: string;
  recommendation?: string;
};

export type Severity = {
  id: number;
  colour: string;
  name: string | null;
  description: string | null;
};

export type InfoPage = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Quiz = {
  id: number;
  infoPageId: number | null;
  name: string | null;
};
