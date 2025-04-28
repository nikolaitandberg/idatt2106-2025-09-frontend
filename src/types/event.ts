export interface Event {
  id: number;
  info_page_id: number | null;
  latitude: number;
  longitude: number;
  radius: number;
  start_time: string;
  end_time: string | null;
  severityId: number;
  recomendation: string | null;
}

export interface Severity {
  id: number;
  colour: string;
  name: string | null;
  description: string | null;
}