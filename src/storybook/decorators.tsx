import React from 'react';

import type { Decorator } from '@storybook/nextjs-vite';

// Layout for stories only. Storybook leaves decorators out of the code on the Docs page,
// so the code shows just the parts.

/** Puts the parts of a story next to each other. */
export const withRow: Decorator = (Story) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
    <Story />
  </div>
);

/** Gives the story the width of a card or a sidebar. */
export const withMaxWidth =
  (maxWidth: number): Decorator =>
  (Story) => (
    <div style={{ maxWidth }}>
      <Story />
    </div>
  );
