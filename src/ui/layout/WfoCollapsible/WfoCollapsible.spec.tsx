import React, { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { WfoCollapsiblePanel, WfoCollapsibleRoot, WfoCollapsibleTrigger } from './WfoCollapsible';

const Example = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <WfoCollapsibleRoot open={isOpen} onOpenChange={setIsOpen}>
      <WfoCollapsibleTrigger label="Toggle details" />
      <WfoCollapsiblePanel>Hidden content</WfoCollapsiblePanel>
    </WfoCollapsibleRoot>
  );
};

describe('WfoCollapsible', () => {
  it('is closed at first and opens and closes with the trigger', () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Toggle details' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hidden content')).toBeVisible();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });
});
