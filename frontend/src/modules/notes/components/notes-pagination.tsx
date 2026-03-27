'use client';

import * as React from 'react';

interface NotesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function NotesPagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: NotesPaginationProps) {
  if (totalPages <= 1) return null;

  const showing = Math.min((currentPage + 1) * pageSize, totalElements);

  function getPageNumbers(): (number | '...')[] {
    const pages: (number | '...')[] = [];

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(0);

    if (currentPage > 2) pages.push('...');

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push('...');

    pages.push(totalPages - 1);

    return pages;
  }

  return (
    <div className="flex items-center justify-between border-t border-border pt-6">
      <p className="text-sm text-muted-foreground">
        Mostrando <span className="font-semibold text-foreground">{showing}</span> de{' '}
        <span className="font-semibold text-foreground">{totalElements}</span> notas
      </p>
      <nav className="flex items-center gap-1">
        <button
          className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-accent disabled:opacity-50"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`dots-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`size-10 rounded-lg font-bold transition-colors ${
                page === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:bg-accent'
              }`}
              onClick={() => onPageChange(page)}
            >
              {page + 1}
            </button>
          )
        )}

        <button
          className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-accent disabled:opacity-50"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Próxima página"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
