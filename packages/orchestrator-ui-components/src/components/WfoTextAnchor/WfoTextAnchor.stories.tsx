import React from 'react';

import type { Meta } from '@storybook/react';

import { WfoTextAnchor } from './WfoTextAnchor';

const Story: Meta<typeof WfoTextAnchor> = {
  component: ({ text, url }) => <WfoTextAnchor text={text} url={url} />,
  title: 'Text/WfoTextAnchor',
};
export default Story;

export const Primary = {
  args: {
    text: 'Text',
    url: 'Url',
  },
};
