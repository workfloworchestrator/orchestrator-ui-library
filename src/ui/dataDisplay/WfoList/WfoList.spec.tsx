import React from 'react';

import { render, screen } from '@testing-library/react';

import { WfoList, WfoListItem } from './WfoList';

describe('WfoList', () => {
  it('shows the items in a list named by the title', () => {
    render(
      <WfoList title="Most recent" emptyText="No items">
        <WfoListItem description="Yesterday">Create Node</WfoListItem>
        <WfoListItem>Modify L2VPN</WfoListItem>
      </WfoList>,
    );

    expect(screen.getByRole('list', { name: 'Most recent' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.queryByText('No items')).not.toBeInTheDocument();
  });

  it('shows the empty text when there are no items', () => {
    render(<WfoList title="Most recent" emptyText="No items" />);

    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
