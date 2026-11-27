import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { WfoButton } from './WfoButton';

describe('WfoButton', () => {
  it('shows the icon and text and calls onClick', () => {
    const handleClick = jest.fn();
    render(
      <WfoButton onClick={handleClick} icon={<svg data-testid="icon" />}>
        Reset layout
      </WfoButton>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reset layout' }));

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('keeps the icon out of the accessible name, even when the icon has its own title', () => {
    render(
      <WfoButton
        icon={
          <svg>
            <title>icon/refresh</title>
          </svg>
        }
      >
        Reset layout
      </WfoButton>,
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Reset layout');
  });

  it('puts the icon after the text with iconPosition end', () => {
    render(
      <WfoButton icon={<svg data-testid="icon" />} iconPosition="end">
        Next
      </WfoButton>,
    );

    expect(screen.getByRole('button').lastElementChild).toContainElement(screen.getByTestId('icon'));
  });

  it('uses the aria-label as name for an icon-only button', () => {
    render(<WfoButton icon={<svg />} aria-label="Refresh" />);

    expect(screen.getByRole('button', { name: 'Refresh' })).toHaveAttribute('data-icon-only');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <WfoButton onClick={handleClick} disabled>
        Expand all
      </WfoButton>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('blocks clicks while loading, but stays focusable', () => {
    const handleClick = jest.fn();
    render(
      <WfoButton onClick={handleClick} isLoading>
        Save
      </WfoButton>,
    );
    const button = screen.getByRole('button', { name: 'Save' });

    fireEvent.click(button);
    button.focus();

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveFocus();
  });

  it('shows a spinner in place of the icon while loading', () => {
    render(
      <WfoButton isLoading icon={<svg data-testid="refresh-icon" />}>
        Refresh
      </WfoButton>,
    );

    expect(screen.queryByTestId('refresh-icon')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Refresh' }).querySelector('[aria-hidden="true"] [role="status"]'),
    ).toBeInTheDocument();
  });

  it('is a medium primary button by default, and takes the full width when asked', () => {
    render(<WfoButton isFullWidth>Save</WfoButton>);
    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-color', 'default');
    expect(button).toHaveAttribute('data-size', 'medium');
    expect(button).toHaveAttribute('data-full-width', '');
  });
});
