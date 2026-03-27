// Note request/response types matching backend DTOs

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageNoteResponse {
  content: NoteResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface CreateNoteResponse {
  message: string;
  data: NoteResponse;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}

export interface UpdateNoteResponse {
  message: string;
  data: NoteResponse;
}

export interface ToggleCompletedResponse {
  message: string;
  data: NoteResponse;
}

export type NoteFilter = 'all' | 'in_progress' | 'completed';
