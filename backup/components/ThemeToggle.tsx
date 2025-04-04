'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark-theme';

  return (
    <button 
      onClick={() => setTheme(isDark ? 'light' : 'dark-theme')}
      className="theme-toggle" 
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
} 