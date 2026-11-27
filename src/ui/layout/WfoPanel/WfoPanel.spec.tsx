import React from 'react';

import { render } from '@testing-library/react';

import { WfoPanel } from './WfoPanel';

describe('WfoPanel', () => {
  it.each([
    [undefined, 'var(--wfo-space-200)'],
    [300, 'var(--wfo-space-300)'],
    [0, '0'],
  ] as const)('maps padding %s to %s', (padding, expectedPadding) => {
    const { container } = render(<WfoPanel padding={padding}>Content</WfoPanel>);

    expect(container.firstElementChild).toHaveStyle({ '--wfo-panel-padding': expectedPadding });
  });
});
