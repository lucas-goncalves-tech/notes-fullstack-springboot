'use client';

import * as React from 'react';
import type { NoteFilter } from '@/modules/notes/types';

interface NotesFiltersProps {
  activeFilter: NoteFilter;
  onFilterChange: (filter: NoteFilter) => void;
}

export function NotesFilters({ activeFilter, onFilterChange }: NotesFiltersProps) {
  const filters: { key: NoteFilter; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'in_progress', label: 'Em Progresso' },
    { key: 'completed', label: 'Concluídas' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
            activeFilter === filter.key
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'bg-card border border-border text-muted-foreground hover:border-primary'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
