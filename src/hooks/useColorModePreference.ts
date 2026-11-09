import { useCallback, useEffect, useState } from 'react';

import { ColorModes } from '@/types';

// The previous light/dark toggle saved LIGHT under 'colorMode' for everyone who never picked a mode,
// so that key cannot tell a deliberate choice from the old default. A new key lets everyone start on auto.
const COLOR_MODE_STORAGE_KEY = 'colorModePreference';

export const useColorModePreference = () => {
  // Keep the first render identical on the server and client.
  const [colorModePreference, setPreference] = useState(ColorModes.AUTO);
  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    try {
      const storedColorMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
      if (storedColorMode === ColorModes.LIGHT || storedColorMode === ColorModes.DARK) {
        setPreference(storedColorMode);
      }
    } catch {
      // Follow the system when browser storage is unavailable.
    }

    if (typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setSystemIsDark(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setColorModePreference = useCallback((preference: ColorModes) => {
    setPreference(preference);
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, preference);
    } catch {
      // The selected mode still works for this session without storage.
    }
  }, []);

  const colorMode =
    colorModePreference === ColorModes.AUTO ?
      systemIsDark ? ColorModes.DARK
      : ColorModes.LIGHT
    : colorModePreference;

  return { colorModePreference, colorMode, setColorModePreference };
};
