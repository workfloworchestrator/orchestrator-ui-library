import { act, renderHook } from '@testing-library/react';

import { ColorModes } from '@/types';

import { useColorModePreference } from './useColorModePreference';

describe('useColorModePreference', () => {
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  let systemIsDark: boolean;
  let listeners: Set<(event: MediaQueryListEvent) => void>;
  let mediaQuery: {
    readonly matches: boolean;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  const changeSystemPreference = (isDark: boolean) => {
    systemIsDark = isDark;
    act(() => {
      listeners.forEach((listener) => listener({ matches: isDark } as MediaQueryListEvent));
    });
  };

  beforeEach(() => {
    localStorage.clear();
    systemIsDark = false;
    listeners = new Set();
    mediaQuery = {
      get matches() {
        return systemIsDark;
      },
      addEventListener: jest.fn((_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      }),
      removeEventListener: jest.fn((_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      }),
    };
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn(() => mediaQuery),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', originalMatchMedia);
    } else {
      Reflect.deleteProperty(window, 'matchMedia');
    }
  });

  it.each([
    [false, ColorModes.LIGHT],
    [true, ColorModes.DARK],
  ])('defaults to auto and follows system dark mode %s', (isDark, expectedMode) => {
    systemIsDark = isDark;

    const { result } = renderHook(() => useColorModePreference());

    expect(result.current.colorModePreference).toBe(ColorModes.AUTO);
    expect(result.current.colorMode).toBe(expectedMode);
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it.each([
    [ColorModes.LIGHT, true, ColorModes.LIGHT],
    [ColorModes.DARK, false, ColorModes.DARK],
    [ColorModes.AUTO, true, ColorModes.DARK],
    [ColorModes.AUTO, false, ColorModes.LIGHT],
  ])('restores stored %s with system dark mode %s', (preference, isDark, expectedMode) => {
    localStorage.setItem('colorModePreference', preference);
    systemIsDark = isDark;

    const { result } = renderHook(() => useColorModePreference());

    expect(result.current.colorModePreference).toBe(preference);
    expect(result.current.colorMode).toBe(expectedMode);
  });

  it.each([ColorModes.LIGHT, ColorModes.DARK])(
    'ignores %s saved under the legacy colorMode key and follows the system',
    (legacyMode) => {
      localStorage.setItem('colorMode', legacyMode);
      systemIsDark = legacyMode === ColorModes.LIGHT;

      const { result } = renderHook(() => useColorModePreference());

      expect(result.current.colorModePreference).toBe(ColorModes.AUTO);
      expect(result.current.colorMode).toBe(legacyMode === ColorModes.LIGHT ? ColorModes.DARK : ColorModes.LIGHT);
    },
  );

  it('falls back to the system for an invalid stored preference', () => {
    localStorage.setItem('colorModePreference', 'invalid');
    systemIsDark = true;

    const { result } = renderHook(() => useColorModePreference());

    expect(result.current.colorModePreference).toBe(ColorModes.AUTO);
    expect(result.current.colorMode).toBe(ColorModes.DARK);
  });

  it('follows live system changes while retaining the stored auto preference', () => {
    localStorage.setItem('colorModePreference', ColorModes.AUTO);
    const { result } = renderHook(() => useColorModePreference());

    changeSystemPreference(true);

    expect(result.current.colorMode).toBe(ColorModes.DARK);
    expect(result.current.colorModePreference).toBe(ColorModes.AUTO);
    expect(localStorage.getItem('colorModePreference')).toBe(ColorModes.AUTO);

    changeSystemPreference(false);

    expect(result.current.colorMode).toBe(ColorModes.LIGHT);
    expect(localStorage.getItem('colorModePreference')).toBe(ColorModes.AUTO);
  });

  it.each([
    [ColorModes.LIGHT, false, true, ColorModes.DARK],
    [ColorModes.DARK, true, false, ColorModes.LIGHT],
  ])(
    'keeps the %s override through OS changes and uses the latest system setting when auto is restored',
    (preference, initialIsDark, updatedIsDark, expectedAutoMode) => {
      systemIsDark = initialIsDark;
      const { result } = renderHook(() => useColorModePreference());

      act(() => result.current.setColorModePreference(preference));
      changeSystemPreference(updatedIsDark);

      expect(result.current.colorMode).toBe(preference);
      expect(result.current.colorModePreference).toBe(preference);
      expect(localStorage.getItem('colorModePreference')).toBe(preference);

      act(() => result.current.setColorModePreference(ColorModes.AUTO));

      expect(result.current.colorModePreference).toBe(ColorModes.AUTO);
      expect(result.current.colorMode).toBe(expectedAutoMode);
      expect(localStorage.getItem('colorModePreference')).toBe(ColorModes.AUTO);
    },
  );

  it.each([ColorModes.LIGHT, ColorModes.DARK, ColorModes.AUTO])(
    'persists a selected %s preference across remounts',
    (preference) => {
      const firstMount = renderHook(() => useColorModePreference());
      act(() => firstMount.result.current.setColorModePreference(preference));
      firstMount.unmount();
      systemIsDark = true;

      const { result } = renderHook(() => useColorModePreference());

      expect(result.current.colorModePreference).toBe(preference);
      expect(result.current.colorMode).toBe(preference === ColorModes.LIGHT ? ColorModes.LIGHT : ColorModes.DARK);
      expect(localStorage.getItem('colorModePreference')).toBe(preference);
    },
  );

  it('follows the system and allows in-memory overrides when storage reads and writes fail', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage is unavailable', 'SecurityError');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is unavailable', 'SecurityError');
    });
    systemIsDark = true;

    const { result } = renderHook(() => useColorModePreference());

    expect(result.current.colorModePreference).toBe(ColorModes.AUTO);
    expect(result.current.colorMode).toBe(ColorModes.DARK);

    act(() => result.current.setColorModePreference(ColorModes.LIGHT));

    expect(result.current.colorModePreference).toBe(ColorModes.LIGHT);
    expect(result.current.colorMode).toBe(ColorModes.LIGHT);
  });

  it('falls back to light and still supports overrides when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', { value: undefined });
    const { result } = renderHook(() => useColorModePreference());

    expect(result.current.colorModePreference).toBe(ColorModes.AUTO);
    expect(result.current.colorMode).toBe(ColorModes.LIGHT);

    act(() => result.current.setColorModePreference(ColorModes.DARK));

    expect(result.current.colorMode).toBe(ColorModes.DARK);
    expect(localStorage.getItem('colorModePreference')).toBe(ColorModes.DARK);

    act(() => result.current.setColorModePreference(ColorModes.AUTO));

    expect(result.current.colorMode).toBe(ColorModes.LIGHT);
  });

  it('removes its system preference listener on unmount', () => {
    const { unmount } = renderHook(() => useColorModePreference());
    expect(listeners.size).toBe(1);
    const listener = mediaQuery.addEventListener.mock.calls[0][1];

    unmount();

    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', listener);
    expect(listeners.size).toBe(0);
  });
});
