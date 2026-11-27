import React from 'react';

import { render, screen } from '@testing-library/react';

import { WfoLink } from './WfoLink';

describe('WfoLink', () => {
  it('renders an <a> with the href and an extra class', () => {
    render(
      <WfoLink href="/workflows" className="extra">
        Workflows
      </WfoLink>,
    );

    const link = screen.getByRole('link', { name: 'Workflows' });
    expect(link).toHaveAttribute('href', '/workflows');
    expect(link).toHaveClass('root', 'extra');
  });

  it('renders the element from render, for example a router link', () => {
    const RouterLink = (props: React.ComponentProps<'a'>) => <a data-router="" {...props} />;
    render(<WfoLink render={<RouterLink href="/tasks" />}>Tasks</WfoLink>);

    expect(screen.getByRole('link', { name: 'Tasks' })).toHaveAttribute('data-router');
  });
});
