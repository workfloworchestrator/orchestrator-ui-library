/**
 * Renders the filter builder's field selector on its own with the autocomplete hook mocked,
 * so the tests control which paths the "backend" returns for a typed prefix.
 */
import React, { type ComponentProps } from 'react';
import { defaultPlaceholderFieldName } from 'react-querybuilder';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { usePathAutocomplete } from '@/hooks';
import type { PathInfo, WfoQueryBuilderContext } from '@/types';

import { WfoFieldSelector } from './WfoFieldSelector';

jest.mock('@/hooks', () => ({
  usePathAutocomplete: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// EuiComboBox sizes its search input by measuring text on a canvas, which jsdom does not implement.
beforeEach(() => {
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue({ font: '', measureText: () => ({ width: 0 }) } as unknown as CanvasRenderingContext2D);
});

const SAPS_PATH_INFO = {
  path: 'saps',
  type: 'component',
  operators: ['has_component', 'not_has_component'],
  value_schema: {},
  group: 'component',
  ui_types: ['component'],
  availablePaths: ['saps.port'],
} as unknown as PathInfo;

const PREFILLED_FIELD_OPTIONS = new Map([
  ['subscription.insync', ['eq', 'neq']],
  ['subscription.status', ['eq', 'neq', 'like']],
]);

// The mocked backend only knows saps, returned for any prefix of it.
const mockAutocomplete = (loading = false) =>
  jest.mocked(usePathAutocomplete).mockImplementation((prefix) => ({
    paths: prefix && 'saps'.startsWith(prefix) ? [SAPS_PATH_INFO] : [],
    loading,
    error: null,
  }));

const renderFieldSelector = (field: string = defaultPlaceholderFieldName) => {
  const handleOnChange = jest.fn();
  const onFieldSelected = jest.fn();
  const context: WfoQueryBuilderContext = {
    onFieldSelected,
    prefilledFieldOptions: PREFILLED_FIELD_OPTIONS,
    fieldPathInfoMap: new Map(),
    useAdvancedNestedSearch: true,
  };
  const props = {
    handleOnChange,
    rule: { field, operator: '=', value: '' },
    context,
  } as unknown as ComponentProps<typeof WfoFieldSelector>;

  render(<WfoFieldSelector {...props} />);
  return { handleOnChange, onFieldSelected };
};

const getSearchInput = () => screen.getByRole('combobox');
const typeSearchTerm = (searchTerm: string) => fireEvent.change(getSearchInput(), { target: { value: searchTerm } });
const requestedPrefixes = () => jest.mocked(usePathAutocomplete).mock.calls.map(([prefix]) => prefix);
const listedOptions = () => screen.queryAllByRole('option').map((option) => option.textContent);

describe('WfoFieldSelector', () => {
  beforeEach(() => mockAutocomplete());

  it('does not look up the placeholder field and only shows a typing hint before typing', () => {
    renderFieldSelector();

    fireEvent.focus(getSearchInput());

    expect(requestedPrefixes().every((prefix) => prefix === '')).toBe(true);
    expect(listedOptions()).toEqual(['startTypingToLoadOptions']);
    expect(screen.getByRole('option', { name: 'startTypingToLoadOptions' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows the loading state instead of a no-match message while nothing is listed yet', () => {
    mockAutocomplete(true);
    renderFieldSelector();

    typeSearchTerm('unknown');

    expect(screen.getByText('Loading options')).toBeInTheDocument();
    expect(listedOptions()).toEqual([]);
    expect(screen.queryByText(/doesn't match any options/)).not.toBeInTheDocument();
  });

  it('shows the loading state when the previous paths do not match the new text', () => {
    // The hook keeps the previous lookup's paths until the new ones arrive.
    jest
      .mocked(usePathAutocomplete)
      .mockImplementation(() => ({ paths: [SAPS_PATH_INFO], loading: true, error: null }));
    renderFieldSelector();

    typeSearchTerm('sax');

    expect(listedOptions()).toEqual([]);
    expect(screen.getByText('Loading options')).toBeInTheDocument();
    expect(screen.queryByText(/doesn't match any options/)).not.toBeInTheDocument();
  });

  it('keeps listed options visible while the next lookup runs and spins inside the field', () => {
    mockAutocomplete(true);
    renderFieldSelector();

    typeSearchTerm('sa');

    expect(listedOptions()).toEqual(['saps', 'saps.port']);
    expect(screen.queryByText('Loading options')).not.toBeInTheDocument();
    expect(document.querySelector('.euiFormControlLayoutIcons [role="progressbar"]')).toBeInTheDocument();
  });

  it('looks up the typed term and lists the returned paths', () => {
    renderFieldSelector();

    typeSearchTerm('sa');

    expect(requestedPrefixes()).toContain('sa');
    expect(listedOptions()).toEqual(['saps', 'saps.port']);
  });

  it('selects a listed path and reports its operators and path info', () => {
    const { handleOnChange, onFieldSelected } = renderFieldSelector();

    typeSearchTerm('sa');
    fireEvent.click(screen.getByRole('option', { name: 'saps' }));

    expect(handleOnChange).toHaveBeenCalledWith('saps');
    expect(onFieldSelected).toHaveBeenCalledWith('saps', SAPS_PATH_INFO.operators, SAPS_PATH_INFO);
  });

  it('drops the options again as soon as the input is cleared', () => {
    renderFieldSelector();

    typeSearchTerm('sa');
    expect(listedOptions()).toEqual(['saps', 'saps.port']);

    typeSearchTerm('');

    expect(listedOptions()).toEqual(['startTypingToLoadOptions']);
  });

  it('lists matching prefilled fields alongside the backend paths', () => {
    renderFieldSelector();

    typeSearchTerm('ins');
    expect(listedOptions()).toEqual(['subscription.insync']);

    typeSearchTerm('s');
    expect(listedOptions()).toEqual(['subscription.insync', 'subscription.status', 'saps', 'saps.port']);
  });

  it('does not offer the raw typed text as an option and reports no match once loaded', () => {
    renderFieldSelector();

    typeSearchTerm('unknown');

    expect(listedOptions()).toEqual([]);
    expect(screen.getByText(/doesn't match any options/)).toBeInTheDocument();
  });

  it('shows a restored field as selected without an autocomplete request', () => {
    renderFieldSelector('subscription.insync');

    // A plain-text single selection is shown as the value of the search input.
    expect(getSearchInput()).toHaveValue('subscription.insync');
    expect(requestedPrefixes().every((prefix) => prefix === '')).toBe(true);
  });

  it('lists options for the selected field as soon as the selector is opened', () => {
    renderFieldSelector('saps');

    fireEvent.focus(getSearchInput());

    expect(requestedPrefixes()).toContain('saps');
    expect(listedOptions()).toEqual(['saps', 'saps.port']);

    fireEvent.blur(getSearchInput());

    expect(jest.mocked(usePathAutocomplete).mock.lastCall?.[0]).toBe('');
  });
});
