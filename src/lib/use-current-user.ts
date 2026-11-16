'use client';

import { useState, useEffect } from 'react';
import { getRoleTheme, RoleTheme } from './role-theme';

export interface CurrentUser {
  id?: string;
  fullName?: string;
  phone?: string;
  role?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [theme, setTheme] = useState<RoleTheme>(getRoleTheme('OPS_MANAGER'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setTheme(getRoleTheme(parsed.role));
        } else {
          setTheme(getRoleTheme('OPS_MANAGER'));
        }
      } catch {
        setTheme(getRoleTheme('OPS_MANAGER'));
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  return { user, theme, isLoading };
}
