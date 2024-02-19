import React, { FC, ReactElement } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiBadgeGroup,
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSection,
    EuiHeaderSectionItem,
} from '@elastic/eui';
import type { EuiThemeColorMode } from '@elastic/eui';

import {
    WfoEngineStatusBadge,
    WfoEnvironmentBadge,
    WfoFailedTasksBadge,
} from '@/components';
import { WfoWebsocketStatusBadge } from '@/components/WfoBadges/WfoWebsocketStatusBadge';
import { WfoAppLogo } from '@/components/WfoPageTemplate/WfoPageHeader/WfoAppLogo';
import { getWfoPageHeaderStyles } from '@/components/WfoPageTemplate/WfoPageHeader/styles';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoLogoutIcon, WfoSideMenu } from '@/icons';
import { ColorModes } from '@/types';

export interface WfoPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    handleSideMenuClick: () => void;
    handleLogoutClick: () => void;
    onThemeSwitch: (theme: EuiThemeColorMode) => void;
}

const ENABLE_THEME_SWITCH =
    process.env.NEXT_PUBLIC_USE_THEME_TOGGLE === 'true' || false;

export const WfoPageHeader: FC<WfoPageHeaderProps> = ({
    navigationHeight,
    getAppLogo,
    handleSideMenuClick,
    handleLogoutClick,
    onThemeSwitch,
}) => {
    const t = useTranslations('main');
    const { theme, multiplyByBaseUnit, colorMode } = useOrchestratorTheme();
    const { getHeaderStyle, appNameStyle } = useWithOrchestratorTheme(
        getWfoPageHeaderStyles,
    );

    return (
        <EuiHeader css={getHeaderStyle(navigationHeight)}>
            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiHeaderLogo iconType={() => <WfoAppLogo />} />
                    <div css={appNameStyle}>{getAppLogo(navigationHeight)}</div>
                </EuiHeaderSectionItem>

                <EuiHeaderSectionItem>
                    <WfoEnvironmentBadge />
                </EuiHeaderSectionItem>

                <EuiButtonIcon
                    aria-label="Show/Hide side menu"
                    display="empty"
                    iconType={() => (
                        <WfoSideMenu color={theme.colors.emptyShade} />
                    )}
                    css={{ width: 48, height: 48, marginLeft: 10 }}
                    onClick={handleSideMenuClick}
                />
            </EuiHeaderSection>

            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(1) }}>
                        <WfoEngineStatusBadge />
                        <WfoFailedTasksBadge />
                        {WEBSOCKET_FEATURE_TOGGLE && (
                            <WfoWebsocketStatusBadge />
                        )}
                    </EuiBadgeGroup>

                    {ENABLE_THEME_SWITCH && (
                        <EuiButtonIcon
                            aria-label={t(
                                colorMode === ColorModes.LIGHT
                                    ? 'darkMode'
                                    : 'lightMode',
                            )}
                            display="empty"
                            iconType={
                                colorMode === ColorModes.LIGHT ? 'moon' : 'sun'
                            }
                            css={{
                                width: '48px',
                                height: '48px',
                                color: 'white',
                            }}
                            title={t(
                                colorMode === ColorModes.LIGHT
                                    ? 'darkMode'
                                    : 'lightMode',
                            )}
                            onClick={() =>
                                onThemeSwitch(
                                    colorMode === ColorModes.LIGHT
                                        ? ColorModes.DARK
                                        : ColorModes.LIGHT,
                                )
                            }
                        />
                    )}

                    <EuiButtonIcon
                        aria-label="Logout"
                        display="empty"
                        iconType={() => (
                            <WfoLogoutIcon color={theme.colors.emptyShade} />
                        )}
                        css={{
                            width: 48,
                            height: 48,
                        }}
                        onClick={handleLogoutClick}
                    />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};
