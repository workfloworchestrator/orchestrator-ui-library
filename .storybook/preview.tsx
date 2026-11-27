import React from 'react';

import { NextIntlClientProvider } from 'next-intl';

import type { Decorator, Preview } from '@storybook/nextjs-vite';

import messages from '../src/messages/en-GB.json';
import '../src/tokens/generated/tokens.css';
import './preview.css';

// Storybook shows the design system only: tokens, src/ui and the parts built from it. No EUI.
const withDesignSystem: Decorator = (Story, { globals }) => {
  // tokens.css switches the --wfo-* colors on this attribute. In the app, WfoPageTemplate sets it.
  document.documentElement.dataset.wfoColorMode = globals.colorMode;

  return (
    <NextIntlClientProvider locale="en-GB" messages={messages}>
      <Story />
    </NextIntlClientProvider>
  );
};

const preview: Preview = {
  decorators: [withDesignSystem],
  // Every part gets a Docs page with a props table. Subparts (for example ListItem) show there via `subcomponents`.
  tags: ['autodocs'],
  globalTypes: {
    colorMode: {
      description: 'Color mode',
      toolbar: { title: 'Color mode', icon: 'circlehollow', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { colorMode: 'light' },
  parameters: {
    layout: 'padded',
    // Like NL Design System: the code of every example is open on the Docs page.
    // The code shows the rendered JSX, not the story function.
    docs: { canvas: { sourceState: 'shown' }, source: { type: 'dynamic' } },
    options: {
      // Does the part know about the orchestrator (workflows, subscriptions, pages)?
      // No: Design system (src/ui). Yes: Orchestrator (src/components). Orchestrator uses Design system, never the reverse.
      storySort: { order: ['Design system', 'Orchestrator'] },
    },
  },
};

export default preview;
