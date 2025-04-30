export interface InfoPage {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditInfoPageRequest {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
}

export interface CreateInfoPageRequest {
  title: string;
  shortDescription: string;
  content: string;
}
