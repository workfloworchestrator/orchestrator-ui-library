import React, { FC, ReactElement, useState } from 'react';

import { useTranslations } from 'next-intl';

import type { EuiThemeColorMode } from '@elastic/eui';
import {
  EuiBadgeGroup,
  EuiButtonIcon,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiIcon,
  EuiPopover,
  EuiToolTip,
} from '@elastic/eui';

import { WfoEngineStatusBadge, WfoEnvironmentBadge, WfoFailedTasksBadge, WfoWebsocketStatusBadge } from '@/components';
import { WfoVersionIncompatibleBadge } from '@/components/WfoBadges/WfoVersionIncompatibleBadge/WfoVersionIncompatibleBadge';
import { WfoAppLogo } from '@/components/WfoPageTemplate/WfoPageHeader/WfoAppLogo';
import { getWfoPageHeaderStyles } from '@/components/WfoPageTemplate/WfoPageHeader/styles';
import { ORCHESTRATOR_UI_LIBRARY_VERSION } from '@/configuration';
import { useGetOrchestratorConfig, useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { useGetVersionsQuery } from '@/rtk/endpoints/versions';
import { ColorModes } from '@/types';
import { toOptionalArrayEntry } from '@/utils';

import { WfoHamburgerMenu } from './WfoHamburgerMenu';

export interface WfoPageHeaderProps {
  // todo: should be part of theme!
  navigationHeight: number;
  getAppLogo: (navigationHeight: number) => ReactElement;
  onColorModeSwitch: (newColorMode: EuiThemeColorMode) => void;
  isAutoMode?: boolean;
  onAutoModeSelect?: () => void;
}

export const WfoPageHeader: FC<WfoPageHeaderProps> = ({
  navigationHeight,
  getAppLogo,
  onColorModeSwitch,
  isAutoMode = false,
  onAutoModeSelect,
}) => {
  const t = useTranslations('main');
  const { multiplyByBaseUnit, colorMode, theme } = useOrchestratorTheme();
  const orchestratorConfig = useGetOrchestratorConfig();
  const { getHeaderStyle, appLogoStyle, appNameStyle } = useWithOrchestratorTheme(getWfoPageHeaderStyles);
  const { data } = useGetVersionsQuery();
  const coreVersion = data?.version.applicationVersions[0].split(' ')[1] ?? '';
  const [isColorModeMenuOpen, setIsColorModeMenuOpen] = useState(false);

  const currentColorMode =
    isAutoMode ? ColorModes.AUTO
    : colorMode === ColorModes.DARK ? ColorModes.DARK
    : ColorModes.LIGHT;
  const colorModeOptions = [
    { mode: ColorModes.LIGHT, iconType: 'sun', label: t('lightMode') },
    { mode: ColorModes.DARK, iconType: 'moon', label: t('darkMode') },
    ...toOptionalArrayEntry({ mode: ColorModes.AUTO, iconType: 'display', label: t('autoMode') }, !!onAutoModeSelect),
  ];
  const currentColorModeOption = colorModeOptions.find(({ mode }) => mode === currentColorMode) ?? colorModeOptions[0];
  const colorModeButtonLabel = `${t('colorMode')}: ${currentColorModeOption.label}`;

  const selectColorMode = (mode: ColorModes) => {
    setIsColorModeMenuOpen(false);
    if (mode === ColorModes.AUTO) {
      onAutoModeSelect?.();
    } else {
      onColorModeSwitch(mode);
    }
  };

  return (
    <EuiHeader css={getHeaderStyle(navigationHeight)}>
      <EuiHeaderSection>
        <EuiToolTip content={'UI version ' + ORCHESTRATOR_UI_LIBRARY_VERSION}>
          <EuiHeaderSectionItem css={{ paddingTop: theme.size.xs }}>
            <span css={appLogoStyle}>
              <WfoAppLogo />
            </span>
            <div css={appNameStyle}>{getAppLogo(navigationHeight)}</div>
          </EuiHeaderSectionItem>
        </EuiToolTip>
        <EuiHeaderSectionItem>
          <WfoEnvironmentBadge />
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem>
          <WfoVersionIncompatibleBadge
            orchestratorUiVersion={ORCHESTRATOR_UI_LIBRARY_VERSION}
            orchestratorCoreVersion={coreVersion}
          />
        </EuiHeaderSectionItem>
      </EuiHeaderSection>

      <EuiHeaderSection>
        <EuiHeaderSectionItem>
          <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(1) }}>
            <WfoWebsocketStatusBadge hideWhenConnected={true} />
            <WfoEngineStatusBadge />
            <WfoFailedTasksBadge />
          </EuiBadgeGroup>
          {orchestratorConfig.useThemeToggle && (
            <EuiPopover
              button={
                <EuiButtonIcon
                  aria-label={colorModeButtonLabel}
                  display="empty"
                  iconType={currentColorModeOption.iconType}
                  css={{
                    width: theme.base * 3,
                    height: theme.base * 3,
                    color: theme.colors.textGhost,
                  }}
                  title={colorModeButtonLabel}
                  onClick={() => setIsColorModeMenuOpen(!isColorModeMenuOpen)}
                />
              }
              isOpen={isColorModeMenuOpen}
              closePopover={() => setIsColorModeMenuOpen(false)}
              panelPaddingSize="none"
              anchorPosition="downRight"
            >
              <EuiContextMenuPanel
                items={colorModeOptions.map(({ mode, iconType, label }) => (
                  <EuiContextMenuItem
                    key={mode}
                    icon={iconType}
                    role="menuitemradio"
                    aria-checked={mode === currentColorMode}
                    onClick={() => selectColorMode(mode)}
                  >
                    <EuiFlexGroup responsive={false} gutterSize="m" alignItems="center" justifyContent="spaceBetween">
                      {label}
                      {mode === currentColorMode && <EuiIcon type="check" />}
                    </EuiFlexGroup>
                  </EuiContextMenuItem>
                ))}
              />
            </EuiPopover>
          )}

          <WfoHamburgerMenu />
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
    </EuiHeader>
  );
};
