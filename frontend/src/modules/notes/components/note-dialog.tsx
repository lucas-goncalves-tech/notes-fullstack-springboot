'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateNote, useUpdateNote } from '@/modules/notes/hooks/use-notes';
import type { NoteResponse } from '@/modules/notes/types';
import { toast } from 'sonner';

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editNote?: NoteResponse | null;
}

export function NoteDialog({ open, onOpenChange, editNote }: NoteDialogProps) {
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const isEditing = !!editNote;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string).trim();
    const content = (formData.get('content') as string).trim();

    if (isEditing && editNote) {
      updateMutation.mutate(
        { noteId: editNote.id, data: { title, content } },
        {
          onSuccess: (result) => {
            toast.success(result.message || 'Nota atualizada!');
            onOpenChange(false);
          },
          onError: () => {
            toast.error('Erro ao atualizar nota.');
          },
        }
      );
    } else {
      createMutation.mutate(
        { title, content },
        {
          onSuccess: (result) => {
            toast.success(result.message || 'Nota criada!');
            onOpenChange(false);
          },
          onError: () => {
            toast.error('Erro ao criar nota.');
          },
        }
      );
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Nota' : 'Nova Nota'}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="note-title" className="block text-sm font-medium text-foreground">
              Título
            </label>
            <Input
              id="note-title"
              name="title"
              placeholder="Título da nota"
              required
              minLength={4}
              maxLength={255}
              defaultValue={editNote?.title ?? ''}
              className="bg-card"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="note-content" className="block text-sm font-medium text-foreground">
              Conteúdo
            </label>
            <textarea
              id="note-content"
              name="content"
              placeholder="Escreva o conteúdo da nota..."
              required
              minLength={10}
              maxLength={255}
              rows={5}
              defaultValue={editNote?.content ?? ''}
              className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground">
              {isPending
                ? isEditing
                  ? 'Salvando...'
                  : 'Criando...'
                : isEditing
                  ? 'Salvar'
                  : 'Criar Nota'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
