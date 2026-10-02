import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { WfoPopoverContent } from './WfoPopoverContent';

jest.mock('@/hooks', () => ({
  useWithOrchestratorTheme: () => ({}),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('WfoPopoverContent', () => {
  it('renders a text search field by default', () => {
    render(<WfoPopoverContent fieldName="description" onSearch={jest.fn()} closePopover={jest.fn()} />);

    expect(screen.getByPlaceholderText('search')).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('submits the typed search text', () => {
    const onSearch = jest.fn();
    const closePopover = jest.fn();
    render(<WfoPopoverContent fieldName="description" onSearch={onSearch} closePopover={closePopover} />);

    const searchField = screen.getByPlaceholderText('search');
    fireEvent.change(searchField, { target: { value: 'l2vpn' } });
    fireEvent.submit(searchField);

    expect(onSearch).toHaveBeenCalledWith('l2vpn');
    expect(closePopover).toHaveBeenCalled();
  });

  it('renders a toggle instead of a text search field for a toggle filter', () => {
    render(<WfoPopoverContent fieldName="insync" onSearch={jest.fn()} closePopover={jest.fn()} isToggleFilter />);

    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.queryByPlaceholderText('search')).not.toBeInTheDocument();
  });

  it('submits true, or false after switching the toggle off', () => {
    const onSearch = jest.fn();
    const closePopover = jest.fn();
    render(<WfoPopoverContent fieldName="insync" onSearch={onSearch} closePopover={closePopover} isToggleFilter />);

    fireEvent.click(screen.getByRole('button', { name: 'applyFilter' }));
    expect(onSearch).toHaveBeenLastCalledWith('true');

    fireEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).not.toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'applyFilter' }));
    expect(onSearch).toHaveBeenLastCalledWith('false');
    expect(closePopover).toHaveBeenCalledTimes(2);
  });
});
