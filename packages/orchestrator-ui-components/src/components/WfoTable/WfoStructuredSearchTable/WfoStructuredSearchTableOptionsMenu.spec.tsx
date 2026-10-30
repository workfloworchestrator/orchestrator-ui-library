import React, { type ComponentProps } from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useEmbeddingEnabled } from '@/components/WfoTable/WfoStructuredSearchTable/utils';
import { RetrieverType } from '@/types';

import { WfoStructuredSearchTableOptionsMenu } from './WfoStructuredSearchTableOptionsMenu';

jest.mock('@/hooks', () => ({
  useWithOrchestratorTheme: () => ({}),
  useOrchestratorTheme: () => ({ theme: { size: { m: '12px' } } }),
}));

jest.mock('@/hooks/useEmbeddingEnabled', () => ({
  useEmbeddingEnabled: jest.fn(() => true),
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
  beforeEach(() => {
    jest.mocked(useEmbeddingEnabled).mockReturnValue(true);
  });

  it.each([RetrieverType.Auto, RetrieverType.Fuzzy, RetrieverType.Semantic, RetrieverType.Hybrid])(
    'shows Fuzzy in both menus when embeddings are disabled and the stored selection is %s',
    async (retrieverType) => {
      jest.mocked(useEmbeddingEnabled).mockReturnValue(false);
      const { onUpdateRetrieverType } = renderOptionsMenu({ retrieverType });

      expect(screen.queryByText('retrieval: auto')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText('retrieval: retrieverFuzzy'));

      expect(await screen.findByText('retrieverFuzzy')).toBeInTheDocument();
      expect(screen.queryByText('retrieverAuto')).not.toBeInTheDocument();
      expect(screen.queryByText('retrieverSemantic')).not.toBeInTheDocument();
      expect(screen.queryByText('retrieverHybrid')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('retrieverFuzzy'));
      expect(onUpdateRetrieverType).toHaveBeenCalledWith(RetrieverType.Fuzzy);
    },
  );

  it('offers all retrievers when the backend enables embedding support', async () => {
    renderOptionsMenu();

    fireEvent.click(screen.getByText('retrieval: retrieverAuto'));

    expect(await screen.findByText('retrieverAuto')).toBeInTheDocument();
    expect(screen.getByText('retrieverFuzzy')).toBeInTheDocument();
    expect(screen.getByText('retrieverSemantic')).toBeInTheDocument();
    expect(screen.getByText('retrieverHybrid')).toBeInTheDocument();
  });

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
    renderOptionsMenu({
      bulkEdit: { isBulkEditAvailable: false, isBulkEditMode: false, handleToggleBulkEditMode: jest.fn() },
    });

    expect(screen.queryByText('downloadCsv')).not.toBeInTheDocument();
    expect(screen.queryByText('bulkEditMode')).not.toBeInTheDocument();
  });

  it('downloads the CSV and toggles the bulk edit mode', () => {
    const onExportData = jest.fn();
    const handleToggleBulkEditMode = jest.fn();
    renderOptionsMenu({
      onExportData,
      bulkEdit: { isBulkEditAvailable: true, isBulkEditMode: false, handleToggleBulkEditMode },
    });

    fireEvent.click(screen.getByText('downloadCsv'));
    expect(onExportData).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'options' }));
    fireEvent.click(screen.getByText('bulkEditMode'));
    expect(handleToggleBulkEditMode).toHaveBeenCalledWith(true);
  });
});
