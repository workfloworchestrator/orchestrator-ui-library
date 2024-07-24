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
import { ColorModes } from '@/types';

import { WfoHamburgerMenu } from './WfoHamburgerMenu';

export interface WfoPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    onThemeSwitch: (theme: EuiThemeColorMode) => void;
}

export const WfoPageHeader: FC<WfoPageHeaderProps> = ({
    navigationHeight,
    getAppLogo,
    onThemeSwitch,
}) => {
    const t = useTranslations('main');
    const { multiplyByBaseUnit, colorMode, theme } = useOrchestratorTheme();
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
                                width: theme.base * 3,
                                height: theme.base * 3,
                                color: theme.colors.ghost,
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

                    <WfoHamburgerMenu />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};
