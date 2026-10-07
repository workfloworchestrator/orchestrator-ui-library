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

  it('renders a True and a False button instead of a text search field for a toggle filter', () => {
    render(<WfoPopoverContent fieldName="insync" onSearch={jest.fn()} closePopover={jest.fn()} isToggleFilter />);

    expect(screen.getByRole('button', { name: 'True' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'False' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'applyFilter' })).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('search')).not.toBeInTheDocument();
  });

  it.each([
    ['True', 'true'],
    ['False', 'false'],
  ])('applies the filter and closes the popover when %s is clicked', (buttonName, expectedSearchText) => {
    const onSearch = jest.fn();
    const closePopover = jest.fn();
    render(<WfoPopoverContent fieldName="insync" onSearch={onSearch} closePopover={closePopover} isToggleFilter />);

    fireEvent.click(screen.getByRole('button', { name: buttonName }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith(expectedSearchText);
    expect(closePopover).toHaveBeenCalledTimes(1);
  });
});
