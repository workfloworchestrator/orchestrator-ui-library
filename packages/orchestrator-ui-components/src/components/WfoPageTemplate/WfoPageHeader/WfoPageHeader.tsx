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
import { WfoAppLogo } from '@/components/WfoPageTemplate/WfoPageHeader/WfoAppLogo';
import { getWfoPageHeaderStyles } from '@/components/WfoPageTemplate/WfoPageHeader/styles';
import {
    useGetOrchestratorConfig,
    useOrchestratorTheme,
    useWithOrchestratorTheme,
} from '@/hooks';
import { WfoLogoutIcon } from '@/icons';
import { ColorModes } from '@/types';

export interface WfoPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    handleLogoutClick: () => void;
    onThemeSwitch: (theme: EuiThemeColorMode) => void;
}

export const WfoPageHeader: FC<WfoPageHeaderProps> = ({
    navigationHeight,
    getAppLogo,
    handleLogoutClick,
    onThemeSwitch,
}) => {
    const t = useTranslations('main');
    const { theme, multiplyByBaseUnit, colorMode } = useOrchestratorTheme();
    const orchestratorConfig = useGetOrchestratorConfig();
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
            </EuiHeaderSection>

            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(1) }}>
                        <WfoEngineStatusBadge />
                        <WfoFailedTasksBadge />
                    </EuiBadgeGroup>

                    {orchestratorConfig.useThemeToggle && (
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
                            <WfoLogoutIcon color={theme.colors.ghost} />
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
