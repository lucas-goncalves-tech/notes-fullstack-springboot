'use client';

import * as React from 'react';
import type { NoteResponse } from '@/modules/notes/types';
import { useToggleNote, useDeleteNote } from '@/modules/notes/hooks/use-notes';
import { toast } from 'sonner';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Agora';
  if (diffMinutes < 60) return `${diffMinutes}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface NoteCardProps {
  note: NoteResponse;
  onEdit: (note: NoteResponse) => void;
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const toggleMutation = useToggleNote();
  const deleteMutation = useDeleteNote();

  function handleToggle() {
    toggleMutation.mutate(note.id, {
      onSuccess: (result) => {
        toast.success(result.message || 'Status atualizado!');
      },
      onError: () => {
        toast.error('Erro ao atualizar status da nota.');
      },
    });
  }

  function handleDelete() {
    deleteMutation.mutate(note.id, {
      onSuccess: () => {
        toast.success('Nota deletada com sucesso!');
      },
      onError: () => {
        toast.error('Erro ao deletar nota.');
      },
    });
  }

  return (
    <div className="group bg-card border border-border rounded-xl p-5 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full relative overflow-hidden">
      {/* Hover action buttons */}
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={() => onEdit(note)}
          className="p-1.5 bg-accent rounded-lg text-muted-foreground hover:text-primary transition-colors"
          aria-label="Editar nota"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
        <button
          onClick={handleToggle}
          disabled={toggleMutation.isPending}
          className="p-1.5 bg-accent rounded-lg text-muted-foreground hover:text-chart-5 transition-colors"
          aria-label="Alternar conclusão"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {note.completed ? (
              <><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></>
            ) : (
              <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>
            )}
          </svg>
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="p-1.5 bg-accent rounded-lg text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Deletar nota"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
      </div>

      {/* Status badge */}
      <div className="mb-4">
        {note.completed ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
            Concluída
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            Em Progresso
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`text-lg font-bold mb-2 transition-colors ${
        note.completed
          ? 'line-through text-muted-foreground'
          : 'group-hover:text-primary'
      }`}>
        {note.title}
      </h3>

      {/* Content preview */}
      <p className={`text-sm line-clamp-3 mb-6 flex-1 ${
        note.completed
          ? 'text-muted-foreground italic'
          : 'text-muted-foreground'
      }`}>
        {note.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {formatRelativeTime(note.updatedAt)}
        </span>
        {note.completed && (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" />
          </svg>
        )}
      </div>
    </div>
  );
}
