'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors flex items-center justify-center opacity-50">
        <Sun className="size-5" />
      </button>
    );
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors flex items-center justify-center"
      aria-label="Alternar modo de cor"
      title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
