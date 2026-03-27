'use client';

import * as React from 'react';
import { useNotes } from '@/modules/notes/hooks/use-notes';
import { NoteCard } from '@/modules/notes/components/note-card';
import { NotesSearch } from '@/modules/notes/components/notes-search';
import { NotesFilters } from '@/modules/notes/components/notes-filters';
import { NotesPagination } from '@/modules/notes/components/notes-pagination';
import { NoteDialog } from '@/modules/notes/components/note-dialog';
import { EmptyNoteCard } from '@/modules/notes/components/empty-note-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { NoteFilter, NoteResponse } from '@/modules/notes/types';

const PAGE_SIZE = 8;

export default function DashboardPage() {
  const [searchValue, setSearchValue] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [activeFilter, setActiveFilter] = React.useState<NoteFilter>('all');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editNote, setEditNote] = React.useState<NoteResponse | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading, isError } = useNotes({
    page: currentPage,
    size: PAGE_SIZE,
    title: debouncedSearch || undefined,
  });

  // Client-side filtering for completed/in-progress
  const filteredNotes = React.useMemo(() => {
    if (!data?.content) return [];
    if (activeFilter === 'all') return data.content;
    if (activeFilter === 'completed') return data.content.filter((n) => n.completed);
    return data.content.filter((n) => !n.completed);
  }, [data?.content, activeFilter]);

  function handleEdit(note: NoteResponse) {
    setEditNote(note);
    setDialogOpen(true);
  }

  function handleCreate() {
    setEditNote(null);
    setDialogOpen(true);
  }

  function handleFilterChange(filter: NoteFilter) {
    setActiveFilter(filter);
  }

  return (
    <>
      {/* Search and Add button */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <NotesSearch value={searchValue} onChange={setSearchValue} />
        <button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
          </svg>
          Nova Nota
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <NotesFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[240px] rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-destructive text-lg font-semibold">Erro ao carregar notas</p>
          <p className="text-muted-foreground mt-2">Tente recarregar a página.</p>
        </div>
      ) : filteredNotes.length === 0 && !debouncedSearch ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <EmptyNoteCard onClick={handleCreate} />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Nenhuma nota encontrada</p>
          <p className="text-muted-foreground mt-2 text-sm">Tente buscar por outro termo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} />
          ))}
          <EmptyNoteCard onClick={handleCreate} />
        </div>
      )}

      {/* Pagination */}
      {data && (
        <NotesPagination
          currentPage={data.page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          pageSize={data.size}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Create/Edit Dialog */}
      <NoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editNote={editNote}
      />
    </>
  );
}
