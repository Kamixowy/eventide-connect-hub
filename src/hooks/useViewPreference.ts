
import { useState, useEffect } from 'react';

type ViewType = 'grid' | 'list';

export const useViewPreference = (pageKey: string, defaultView: ViewType = 'grid') => {
  const [viewType, setViewType] = useState<ViewType>(defaultView);

  // Load preference from cookie on mount
  useEffect(() => {
    const cookieValue = getCookie(`view-preference-${pageKey}`);
    if (cookieValue === 'grid' || cookieValue === 'list') {
      setViewType(cookieValue);
    }
  }, [pageKey]);

  // Save preference when it changes
  const setViewPreference = (newViewType: ViewType) => {
    setViewType(newViewType);
    setCookie(`view-preference-${pageKey}`, newViewType, 365); // Store for a year
  };

  return { viewType, setViewPreference };
};

// Helper functions for cookie management
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};
