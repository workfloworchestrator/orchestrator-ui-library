import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoLink } from './WfoLink';

const meta: Meta<typeof WfoLink> = {
  title: 'Design system/Link',
  component: WfoLink,
  parameters: {
    docs: {
      description: {
        // WfoLink is built with useRender, so Storybook cannot read its comment. Keep this the same as in WfoLink.tsx.
        component:
          'Goes to another page or place. It renders an `<a>` and takes the font of the text or heading around it. For an action on the same page, use `WfoButton`. Takes every native `<a>` prop. For a router link, pass it in `render`, for example `render={<NextLink href="/workflows" />}`.',
      },
    },
  },
};
export default meta;

/** The same link in running text and in a heading. It takes the font of what is around it. */
export const InTextAndHeading: StoryObj<typeof WfoLink> = {
  render: () => (
    <div>
      <p>
        Read the <WfoLink href="#workflows">workflow guide</WfoLink> before you start.
      </p>
      <h2>
        <WfoLink href="#active-workflows">Active workflows</WfoLink>
      </h2>
    </div>
  ),
};
