import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { WfoStartButtonComboBox } from './WfoStartButtonComboBox';
import { filterGroupedStartOptions, getStartWorkflowComboBoxOptions } from './utils';

jest.mock('@/hooks', () => ({
  useGetOrchestratorConfig: () => ({ startWorkflowFilters: undefined }),
  useOrchestratorTheme: () => ({ theme: { colors: {}, size: {} } }),
  useWithOrchestratorTheme: () => ({}),
}));

// The @/utils barrel imports the whole component tree, which hits a circular import in Jest
jest.mock('@/utils', () => jest.requireActual('@/utils/getProductLifecycleStatus'));

const groupedOptions = getStartWorkflowComboBoxOptions(
  [
    { workflowName: 'create_node', productId: 'id-node', productName: 'node Cisco' },
    { workflowName: 'create_core_link', productId: 'id-core-link', productName: 'core link' },
    { workflowName: 'create_ip_service', productId: 'id-ip-service', productName: 'ip service' },
  ],
  'name',
  { 'CESNET BB': ['node Cisco', 'core link'] },
  'Other',
);

const renderComboBox = (onOptionChange = jest.fn()) => {
  render(
    <WfoStartButtonComboBox
      buttonText="New subscription"
      options={groupedOptions}
      onOptionChange={onOptionChange}
      filterOptions={filterGroupedStartOptions}
      isProcess
    />,
  );
  return onOptionChange;
};

const openDropdown = () => fireEvent.click(screen.getByText('New subscription'));
const getSearchField = () => screen.getByPlaceholderText('Filter options');

describe('WfoStartButtonComboBox with grouped options', () => {
  // EuiSelectable virtualizes its list and only renders rows once its container has a size, which jsdom never gives it
  let getBoundingClientRect: jest.SpyInstance;

  beforeEach(() => {
    getBoundingClientRect = jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ width: 300, height: 400, top: 0, left: 0, right: 300, bottom: 400, x: 0, y: 0 } as DOMRect);
  });

  afterEach(() => {
    getBoundingClientRect.mockRestore();
  });

  it('keeps all products of a group matching the search value under its heading', () => {
    renderComboBox();
    openDropdown();

    fireEvent.change(getSearchField(), { target: { value: 'bb' } });

    expect(screen.getByText('CESNET BB')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /^core link/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /^node Cisco/ })).toBeInTheDocument();
    expect(screen.queryByText('Other')).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /^ip service/ })).not.toBeInTheDocument();
  });

  it('selects the first product, not the group heading, by keyboard', () => {
    const onOptionChange = renderComboBox();
    openDropdown();

    const searchField = getSearchField();
    fireEvent.change(searchField, { target: { value: 'bb' } });
    fireEvent.keyDown(searchField, { key: 'ArrowDown' });
    fireEvent.keyDown(searchField, { key: 'Enter' });

    expect(onOptionChange).toHaveBeenCalledTimes(1);
    expect(onOptionChange).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'core link',
        data: { workflowName: 'create_core_link', productId: 'id-core-link' },
      }),
    );
  });

  it('resets the search when the dropdown is closed and opened again', () => {
    renderComboBox();
    openDropdown();
    fireEvent.change(getSearchField(), { target: { value: 'bb' } });
    expect(screen.queryByRole('option', { name: /^ip service/ })).not.toBeInTheDocument();

    openDropdown();
    openDropdown();

    expect(getSearchField()).toHaveValue('');
    expect(screen.getByText('Other')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /^ip service/ })).toBeInTheDocument();
  });
});
