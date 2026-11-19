import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { OrchestratorConfigContext } from '@/contexts';
import { useWfoSession } from '@/hooks';
import { reauthenticate } from '@/rtk/session';

import { WfoAuth } from './WfoAuth';

// The @/components and @/contexts barrels import the whole component tree, which hits a circular import in Jest
jest.mock('@/components', () => ({ WfoLogoSpinner: () => <div>spinner</div> }));
jest.mock('@/contexts', () => ({
  OrchestratorConfigContext: jest.requireActual('react').createContext({ authActive: true }),
}));
jest.mock('@/hooks', () => ({ useWfoSession: jest.fn() }));
jest.mock('@/rtk/session', () => ({ reauthenticate: jest.fn() }));

const mockSession = (status: string, session: object | null) =>
  jest.mocked(useWfoSession).mockReturnValue({ status, session } as unknown as ReturnType<typeof useWfoSession>);

const wfoAuthWithPage = (authActive = true) => (
  <OrchestratorConfigContext.Provider value={{ authActive } as React.ContextType<typeof OrchestratorConfigContext>}>
    <WfoAuth>
      <div>page</div>
    </WfoAuth>
  </OrchestratorConfigContext.Provider>
);

const renderWfoAuth = (authActive = true) => render(wfoAuthWithPage(authActive));

describe('WfoAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the page for a valid session', () => {
    mockSession('authenticated', { accessToken: 'a' });

    renderWfoAuth();

    expect(screen.getByText('page')).toBeInTheDocument();
    expect(reauthenticate).not.toHaveBeenCalled();
  });

  it('shows a spinner while the session loads', () => {
    mockSession('loading', null);

    renderWfoAuth();

    expect(screen.getByText('spinner')).toBeInTheDocument();
    expect(screen.queryByText('page')).not.toBeInTheDocument();
  });

  it('shows a spinner, not the page, and signs in again one time for an expired session', () => {
    mockSession('authenticated', { error: 'AccessTokenExpired' });

    const { rerender } = renderWfoAuth();
    // A new render with the same expired session, e.g. after a session refetch on window focus
    rerender(wfoAuthWithPage());

    expect(screen.getByText('spinner')).toBeInTheDocument();
    expect(screen.queryByText('page')).not.toBeInTheDocument();
    expect(reauthenticate).toHaveBeenCalledTimes(1);
  });

  it('ignores a session error when auth is not active', () => {
    mockSession('authenticated', { error: 'AccessTokenExpired' });

    renderWfoAuth(false);

    expect(screen.getByText('page')).toBeInTheDocument();
    expect(reauthenticate).not.toHaveBeenCalled();
  });
});
