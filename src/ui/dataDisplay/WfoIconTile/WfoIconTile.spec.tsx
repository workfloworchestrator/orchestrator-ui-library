import React from 'react';

import { render, screen } from '@testing-library/react';

import { WfoIconTile } from './WfoIconTile';

describe('WfoIconTile', () => {
  it.each(['info', 'success', 'warning', 'danger'] as const)('shows the glyph with the %s color class', (color) => {
    render(
      <WfoIconTile color={color}>
        <svg data-testid="glyph" />
      </WfoIconTile>,
    );

    const tile = screen.getByTestId('glyph').parentElement;
    expect(tile).toHaveAttribute('data-color', color);
    expect(tile).toHaveClass('root', color);
  });

  it('is decoration only, hidden from screen readers', () => {
    render(<WfoIconTile color="info">x</WfoIconTile>);

    expect(screen.getByText('x')).toHaveAttribute('aria-hidden', 'true');
  });
});
