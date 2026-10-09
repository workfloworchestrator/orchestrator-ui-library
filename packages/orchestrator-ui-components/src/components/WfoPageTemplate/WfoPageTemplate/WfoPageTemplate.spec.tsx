import React, { ReactNode, useState } from 'react';

import { EuiThemeColorMode, EuiThemeProvider } from '@elastic/eui';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { WfoPageHeader } from '@/components/WfoPageTemplate/WfoPageHeader/WfoPageHeader';

import { WfoPageTemplate } from './WfoPageTemplate';

// Keep the actual preference hook and header together while replacing unrelated
// application services and EUI layout with a minimal theme context.
jest.mock('@elastic/eui', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const ThemeContext = React.createContext<EuiThemeColorMode>('LIGHT');
  const Container = ({ children }: { children?: ReactNode }) => <div>{children}</div>;

  return {
    EuiThemeProvider: ({ children, colorMode }: { children: ReactNode; colorMode: EuiThemeColorMode }) => (
      <ThemeContext.Provider value={colorMode}>{children}</ThemeContext.Provider>
    ),
    useEuiTheme: () => ({ colorMode: React.useContext(ThemeContext) }),
    EuiPageTemplate: Object.assign(Container, { Sidebar: Container, Section: Container }),
    EuiHeader: Container,
    EuiHeaderSection: Container,
    EuiHeaderSectionItem: Container,
    EuiToolTip: Container,
    EuiBadgeGroup: Container,
    EuiFlexGroup: Container,
    EuiIcon: () => null,
    EuiButtonIcon: ({
      'aria-label': label,
      iconType,
      onClick,
    }: {
      'aria-label': string;
      iconType: string;
      onClick: () => void;
    }) => <button aria-label={label} data-icon={iconType} onClick={onClick} />,
    EuiPopover: ({ button, isOpen, children }: { button: ReactNode; isOpen: boolean; children: ReactNode }) => (
      <>
        {button}
        {isOpen && children}
      </>
    ),
    EuiContextMenuPanel: ({ items }: { items: ReactNode[] }) => <div role="menu">{items}</div>,
    EuiContextMenuItem: ({
      children,
      onClick,
      'aria-checked': checked,
    }: {
      children: ReactNode;
      onClick: () => void;
      'aria-checked': boolean;
    }) => (
      <button role="menuitemradio" aria-checked={checked} onClick={onClick}>
        {children}
      </button>
    ),
  };
});

jest.mock('@/hooks', () => ({
  useColorModePreference: jest.requireActual('@/hooks/useColorModePreference').useColorModePreference,
  useGetOrchestratorConfig: () => ({ useThemeToggle: true }),
  useOrchestratorTheme: () => ({
    ...jest.requireMock('@elastic/eui').useEuiTheme(),
    multiplyByBaseUnit: (value: number) => value * 8,
    theme: { base: 8, size: { xs: '4px' }, colors: { textGhost: '#fff' } },
  }),
  useWithOrchestratorTheme: () => ({
    NAVIGATION_HEIGHT: 48,
    getHeaderStyle: () => ({}),
    getSidebarStyle: () => ({}),
    getContentStyle: () => ({}),
  }),
}));

jest.mock('@/components', () => ({
  WfoPageHeader: (props: React.ComponentProps<typeof WfoPageHeader>) => {
    const { WfoPageHeader } = jest.requireActual('@/components/WfoPageTemplate/WfoPageHeader/WfoPageHeader');
    return <WfoPageHeader {...props} />;
  },
  WfoSidebar: () => null,
  WfoBreadcrumbs: () => null,
  WfoEnvironmentBadge: () => null,
  WfoWebsocketStatusBadge: () => null,
  WfoEngineStatusBadge: () => null,
  WfoFailedTasksBadge: () => null,
}));

jest.mock('@/components/WfoBadges/WfoVersionIncompatibleBadge/WfoVersionIncompatibleBadge', () => ({
  WfoVersionIncompatibleBadge: () => null,
}));
jest.mock('@/components/WfoPageTemplate/WfoPageHeader/WfoAppLogo', () => ({ WfoAppLogo: () => null }));
jest.mock('@/components/WfoPageTemplate/WfoPageHeader/WfoHamburgerMenu', () => ({ WfoHamburgerMenu: () => null }));
jest.mock('@/rtk/endpoints/versions', () => ({ useGetVersionsQuery: () => ({}) }));
jest.mock('@/configuration', () => ({ ORCHESTRATOR_UI_LIBRARY_VERSION: 'test' }));
jest.mock('@/theme', () => ({ wfoThemeModifications: {} }));
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

const getAppLogo = () => <span>Test application</span>;

const Page = () => {
  const [colorMode, setColorMode] = useState<EuiThemeColorMode>('LIGHT');
  return (
    <>
      <output data-testid="outer-color-mode">{colorMode}</output>
      <WfoPageTemplate getAppLogo={getAppLogo} colorMode={colorMode} setColorMode={setColorMode}>
        Page content
      </WfoPageTemplate>
    </>
  );
};

// The header button shows the current mode; the menu lists every mode and marks the current one.
const colorModeButton = () => screen.getByRole('button', { name: /^colorMode: / });

const selectColorMode = (label: string) => {
  fireEvent.click(colorModeButton());
  fireEvent.click(screen.getByRole('menuitemradio', { name: label }));
};

const setSystemTheme = (initiallyDark: boolean) => {
  let listener: ((event: MediaQueryListEvent) => void) | undefined;
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: () => ({
      matches: initiallyDark,
      addEventListener: (_type: string, callback: typeof listener) => {
        listener = callback;
      },
      removeEventListener: () => {
        listener = undefined;
      },
    }),
  });

  return (matches: boolean) => act(() => listener?.({ matches } as MediaQueryListEvent));
};

describe('page theme controls', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => localStorage.clear());

  afterEach(() => {
    localStorage.clear();
    window.matchMedia = originalMatchMedia;
  });

  it.each([false, true])(
    'shows the current mode and selects any mode from the menu when the OS dark preference is %s',
    (systemIsDark) => {
      setSystemTheme(systemIsDark);
      render(<Page />);

      expect(screen.getByTestId('outer-color-mode')).toHaveTextContent(systemIsDark ? 'DARK' : 'LIGHT');
      expect(colorModeButton()).toHaveAccessibleName('colorMode: autoMode');
      expect(colorModeButton()).toHaveAttribute('data-icon', 'display');

      fireEvent.click(colorModeButton());
      expect(screen.getAllByRole('menuitemradio').map((item) => item.textContent)).toEqual([
        'lightMode',
        'darkMode',
        'autoMode',
      ]);
      expect(screen.getByRole('menuitemradio', { name: 'autoMode' })).toHaveAttribute('aria-checked', 'true');
      fireEvent.click(screen.getByRole('menuitemradio', { name: 'darkMode' }));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByTestId('outer-color-mode')).toHaveTextContent('DARK');
      expect(colorModeButton()).toHaveAccessibleName('colorMode: darkMode');
      expect(colorModeButton()).toHaveAttribute('data-icon', 'moon');
      expect(localStorage.getItem('colorModePreference')).toBe('DARK');

      selectColorMode('lightMode');
      expect(screen.getByTestId('outer-color-mode')).toHaveTextContent('LIGHT');
      expect(colorModeButton()).toHaveAttribute('data-icon', 'sun');
      expect(localStorage.getItem('colorModePreference')).toBe('LIGHT');

      selectColorMode('autoMode');
      expect(screen.getByTestId('outer-color-mode')).toHaveTextContent(systemIsDark ? 'DARK' : 'LIGHT');
      expect(colorModeButton()).toHaveAttribute('data-icon', 'display');
      expect(localStorage.getItem('colorModePreference')).toBe('AUTO');
    },
  );

  it('updates the enclosing provider when the OS changes and keeps a manual selection fixed', () => {
    const changeSystemTheme = setSystemTheme(false);
    render(<Page />);

    changeSystemTheme(true);
    expect(screen.getByTestId('outer-color-mode')).toHaveTextContent('DARK');
    changeSystemTheme(false);
    expect(screen.getByTestId('outer-color-mode')).toHaveTextContent('LIGHT');

    selectColorMode('lightMode');
    changeSystemTheme(true);
    expect(screen.getByTestId('outer-color-mode')).toHaveTextContent('LIGHT');

    selectColorMode('darkMode');
    changeSystemTheme(false);
    expect(screen.getByTestId('outer-color-mode')).toHaveTextContent('DARK');
    selectColorMode('autoMode');
    expect(screen.getByTestId('outer-color-mode')).toHaveTextContent('LIGHT');
  });

  it('restores a selected explicit mode when the page is remounted', () => {
    setSystemTheme(false);
    const { unmount } = render(<Page />);
    selectColorMode('darkMode');
    unmount();

    render(<Page />);
    expect(screen.getByTestId('outer-color-mode')).toHaveTextContent('DARK');
    expect(colorModeButton()).toHaveAccessibleName('colorMode: darkMode');
  });

  it('offers only light and dark for callers without an Auto callback', () => {
    const LegacyHeader = () => {
      const [colorMode, setColorMode] = useState<EuiThemeColorMode>('LIGHT');
      return (
        <EuiThemeProvider colorMode={colorMode}>
          <WfoPageHeader navigationHeight={48} getAppLogo={getAppLogo} onColorModeSwitch={setColorMode} />
        </EuiThemeProvider>
      );
    };
    render(<LegacyHeader />);

    expect(colorModeButton()).toHaveAccessibleName('colorMode: lightMode');
    fireEvent.click(colorModeButton());
    expect(screen.getAllByRole('menuitemradio').map((item) => item.textContent)).toEqual(['lightMode', 'darkMode']);
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'darkMode' }));
    expect(colorModeButton()).toHaveAccessibleName('colorMode: darkMode');
  });
});
