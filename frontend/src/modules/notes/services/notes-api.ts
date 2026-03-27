import { api } from '@/lib/axios';
import type {
  PageNoteResponse,
  CreateNoteRequest,
  CreateNoteResponse,
  UpdateNoteRequest,
  UpdateNoteResponse,
  ToggleCompletedResponse,
} from '@/modules/notes/types';

export async function fetchNotes(params: {
  page?: number;
  size?: number;
  title?: string;
  sort?: string;
}): Promise<PageNoteResponse> {
  const response = await api.get<PageNoteResponse>('/notes', { params });
  return response.data;
}

export async function createNote(data: CreateNoteRequest): Promise<CreateNoteResponse> {
  const response = await api.post<CreateNoteResponse>('/notes', data);
  return response.data;
}

export async function updateNote(
  noteId: string,
  data: UpdateNoteRequest
): Promise<UpdateNoteResponse> {
  const response = await api.patch<UpdateNoteResponse>(`/notes/${noteId}`, data);
  return response.data;
}

export async function toggleNote(noteId: string): Promise<ToggleCompletedResponse> {
  const response = await api.patch<ToggleCompletedResponse>(`/notes/${noteId}/toggle`);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<void> {
  await api.delete(`/notes/${noteId}`);
}
