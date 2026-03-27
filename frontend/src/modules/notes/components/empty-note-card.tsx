'use client';

interface EmptyNoteCardProps {
  onClick: () => void;
}

export function EmptyNoteCard({ onClick }: EmptyNoteCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-muted/50 border-2 border-dashed border-border rounded-xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 min-h-[200px]"
    >
      <div className="size-12 rounded-full bg-card flex items-center justify-center text-muted-foreground group-hover:text-primary shadow-sm transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
      </div>
      <p className="font-semibold text-muted-foreground group-hover:text-primary transition-colors">
        Criar Nova Nota
      </p>
    </button>
  );
}
