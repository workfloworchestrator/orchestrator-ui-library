/** @jest-environment node */
import React from 'react';
import { renderToString } from 'react-dom/server';

import { useColorModePreference } from './useColorModePreference';

it('renders a stable auto/light fallback on the server without browser APIs', () => {
  const ThemePreference = () => {
    const { colorModePreference, colorMode } = useColorModePreference();
    return <span>{`${colorModePreference}:${colorMode}`}</span>;
  };

  expect(renderToString(<ThemePreference />)).toBe('<span>AUTO:LIGHT</span>');
});
