import React, { type ComponentProps } from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { RetrieverType } from '@/types';

import { WfoStructuredSearchTableOptionsMenu } from './WfoStructuredSearchTableOptionsMenu';

jest.mock('@/hooks', () => ({
  useWithOrchestratorTheme: () => ({}),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const renderOptionsMenu = (props: Partial<ComponentProps<typeof WfoStructuredSearchTableOptionsMenu>> = {}) => {
  const defaultProps = {
    onShowTableSettings: jest.fn(),
    advancedNestedSearch: true,
    onToggleAdvancedNestedSearch: jest.fn(),
    retrieverType: RetrieverType.Auto,
    onUpdateRetrieverType: jest.fn(),
  };
  const mergedProps = { ...defaultProps, ...props };
  render(<WfoStructuredSearchTableOptionsMenu {...mergedProps} />);
  fireEvent.click(screen.getByRole('button', { name: 'options' }));
  return mergedProps;
};

describe('WfoStructuredSearchTableOptionsMenu', () => {
  it('opens the table settings', () => {
    const { onShowTableSettings } = renderOptionsMenu();

    fireEvent.click(screen.getByText('tableSettings'));

    expect(onShowTableSettings).toHaveBeenCalledTimes(1);
  });

  it('shows the advanced nested search setting as a checkbox reflecting its current value', () => {
    renderOptionsMenu({ advancedNestedSearch: false });

    expect(screen.getByRole('checkbox', { name: 'advancedNestedSearch' })).not.toBeChecked();
  });

  it('toggles the advanced nested search setting and keeps the menu open', () => {
    const { onToggleAdvancedNestedSearch } = renderOptionsMenu({ advancedNestedSearch: true });

    fireEvent.click(screen.getByRole('checkbox', { name: 'advancedNestedSearch' }));
    expect(onToggleAdvancedNestedSearch).toHaveBeenCalledWith(false);

    expect(screen.getByText('tableSettings')).toBeInTheDocument();
  });

  it('shows the selected retriever and picks another one from the sub panel', async () => {
    const { onUpdateRetrieverType } = renderOptionsMenu({ retrieverType: RetrieverType.Fuzzy });

    fireEvent.click(screen.getByText('retrieval: retrieverFuzzy'));
    fireEvent.click(await screen.findByText('retrieverSemantic'));

    await waitFor(() => expect(onUpdateRetrieverType).toHaveBeenCalledWith(RetrieverType.Semantic));
  });

  it('only offers the CSV download and bulk edit mode when the table supports them', () => {
    renderOptionsMenu();

    expect(screen.queryByText('downloadCsv')).not.toBeInTheDocument();
    expect(screen.queryByText('bulkEditMode')).not.toBeInTheDocument();
  });

  it('downloads the CSV and toggles the bulk edit mode', () => {
    const onExportData = jest.fn();
    const onToggleBulkEditMode = jest.fn();
    renderOptionsMenu({ onExportData, onToggleBulkEditMode, isBulkEditMode: false });

    fireEvent.click(screen.getByText('downloadCsv'));
    expect(onExportData).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'options' }));
    fireEvent.click(screen.getByText('bulkEditMode'));
    expect(onToggleBulkEditMode).toHaveBeenCalledWith(true);
  });
});
