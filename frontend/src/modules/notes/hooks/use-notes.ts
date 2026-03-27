import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote, updateNote, toggleNote, deleteNote } from '@/modules/notes/services/notes-api';
import type { CreateNoteRequest, UpdateNoteRequest } from '@/modules/notes/types';

export const NOTES_QUERY_KEY = 'notes';

export function useNotes(params: { page?: number; size?: number; title?: string }) {
  return useQuery({
    queryKey: [NOTES_QUERY_KEY, params],
    queryFn: () => fetchNotes(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: UpdateNoteRequest }) =>
      updateNote(noteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
  });
}

export function useToggleNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => toggleNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
  });
}
