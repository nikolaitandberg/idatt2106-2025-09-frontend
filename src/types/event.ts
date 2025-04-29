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

export interface InfoPage {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: number;
  info_page_id: number | null;
  name: string | null;
}