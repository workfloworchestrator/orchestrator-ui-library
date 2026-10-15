import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { ORCHESTRATOR_UI_LIBRARY_VERSION } from '@/configuration';
import { useGetVersionsQuery } from '@/rtk/endpoints/versions';

import { WfoHamburgerMenu } from './WfoHamburgerMenu';

jest.mock('next-auth/react', () => ({ signOut: jest.fn() }));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/hooks', () => ({
  useGetOrchestratorConfig: () => ({ enableSupportMenuItem: false, enableAoStackStatus: false }),
  useOrchestratorTheme: () => ({ theme: { colors: {}, base: 16 }, isDarkModeActive: false }),
}));

// The @/utils barrel imports the whole component tree, which hits a circular import in Jest
jest.mock('@/utils', () => jest.requireActual('@/utils/optionalArray'));

jest.mock('@/components/WfoLoading', () => ({ WfoLoading: () => null }));

jest.mock('@/rtk/endpoints/versions', () => ({ useGetVersionsQuery: jest.fn() }));

const libraryVersion = `orchestrator-ui-components: ${ORCHESTRATOR_UI_LIBRARY_VERSION}`;

const mockVersionsQuery = (result: { data: unknown; isFetching: boolean; error: unknown }) =>
  jest.mocked(useGetVersionsQuery).mockReturnValue(result as unknown as ReturnType<typeof useGetVersionsQuery>);

const openVersions = () => {
  fireEvent.click(screen.getByLabelText('openMenu'));
  fireEvent.click(screen.getByText('softwareVersions'));
};

describe('WfoHamburgerMenu', () => {
  it('lists the library and the orchestrator versions', async () => {
    mockVersionsQuery({
      data: { version: { applicationVersions: ['orchestrator-core 5.4.0'] } },
      isFetching: false,
      error: undefined,
    });

    render(<WfoHamburgerMenu />);
    openVersions();

    expect(await screen.findByText(libraryVersion)).toBeInTheDocument();
    expect(screen.getByText('orchestrator-core 5.4.0')).toBeInTheDocument();
  });

  it('lists the library version when the versions query returns no data', async () => {
    mockVersionsQuery({
      data: null,
      isFetching: false,
      error: undefined,
    });

    render(<WfoHamburgerMenu />);
    openVersions();

    expect(await screen.findByText(libraryVersion)).toBeInTheDocument();
  });
});
