import React, { FC, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';

import type { EuiThemeColorMode } from '@elastic/eui';
import { EuiPageTemplate, EuiSideNavItemType, EuiThemeProvider } from '@elastic/eui';

import { WfoBreadcrumbs, WfoPageHeader, WfoSidebar } from '@/components';
import { useColorModePreference, useWithOrchestratorTheme } from '@/hooks';
import { wfoThemeModifications } from '@/theme';
import { ColorModes } from '@/types';

import { ContentContextProvider } from './ContentContext';
import { getPageTemplateStyles } from './styles';

export interface WfoPageTemplateProps {
  getAppLogo: (navigationHeight: number) => ReactElement;
  overrideMenuItems?: (defaultMenuItems: EuiSideNavItemType<object>[]) => EuiSideNavItemType<object>[];
  children: ReactNode;
  colorMode: EuiThemeColorMode;
  setColorMode: React.Dispatch<React.SetStateAction<EuiThemeColorMode>>;
}

export const WfoPageTemplate: FC<WfoPageTemplateProps> = (props) => {
  const { colorMode, setColorMode } = props;
  const { colorModePreference, colorMode: resolvedColorMode, setColorModePreference } = useColorModePreference();

  useEffect(() => {
    setColorMode(resolvedColorMode);
  }, [resolvedColorMode, setColorMode]);

  return (
    <EuiThemeProvider modify={wfoThemeModifications} colorMode={colorMode}>
      <WfoPageTemplateContent
        {...props}
        colorModePreference={colorModePreference}
        setColorModePreference={setColorModePreference}
      />
    </EuiThemeProvider>
  );
};

const WfoPageTemplateContent: FC<
  WfoPageTemplateProps & {
    colorModePreference: ColorModes;
    setColorModePreference: (mode: ColorModes) => void;
  }
> = ({ children, getAppLogo, overrideMenuItems, colorModePreference, setColorModePreference }) => {
  const { getSidebarStyle, NAVIGATION_HEIGHT } = useWithOrchestratorTheme(getPageTemplateStyles);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
  const headerRowRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <WfoPageHeader
        getAppLogo={getAppLogo}
        navigationHeight={NAVIGATION_HEIGHT}
        onColorModeSwitch={(mode) =>
          setColorModePreference(mode === ColorModes.DARK ? ColorModes.DARK : ColorModes.LIGHT)
        }
        isAutoMode={colorModePreference === ColorModes.AUTO}
        onAutoModeSelect={() => setColorModePreference(ColorModes.AUTO)}
      />
      {/* Sidebar and content area */}
      <EuiPageTemplate panelled={false} grow={false} contentBorder={false} restrictWidth={false}>
        {isSideMenuVisible && (
          <EuiPageTemplate.Sidebar css={getSidebarStyle(NAVIGATION_HEIGHT)}>
            <WfoSidebar overrideMenuItems={overrideMenuItems} />
          </EuiPageTemplate.Sidebar>
        )}

        <ContentContextProvider contentRef={headerRowRef} navigationHeight={NAVIGATION_HEIGHT}>
          <EuiPageTemplate.Section
            css={{
              minHeight: `calc(100vh - ${NAVIGATION_HEIGHT}px)`,
            }}
          >
            <WfoBreadcrumbs handleSideMenuClick={() => setIsSideMenuVisible((prevState) => !prevState)} />
            {children}
          </EuiPageTemplate.Section>
        </ContentContextProvider>
      </EuiPageTemplate>
    </>
  );
};
