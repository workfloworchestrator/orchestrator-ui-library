import React, { FC, ReactElement } from 'react';

import {
    EuiBadgeGroup,
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSection,
    EuiHeaderSectionItem,
} from '@elastic/eui';

import {
    WfoEngineStatusBadge,
    WfoEnvironmentBadge,
    WfoFailedTasksBadge,
} from '@/components';
import { WfoAppLogo } from '@/components/WfoPageTemplate/WfoPageHeader/WfoAppLogo';
import { getWfoPageHeaderStyles } from '@/components/WfoPageTemplate/WfoPageHeader/styles';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoLogoutIcon, WfoSideMenu } from '@/icons';

export interface WfoPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    handleSideMenuClick: () => void;
    handleLogoutClick: () => void;
}

export const WfoPageHeader: FC<WfoPageHeaderProps> = ({
    navigationHeight,
    getAppLogo,
    handleSideMenuClick,
    handleLogoutClick,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();
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
                    <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(2) }}>
                        <WfoEngineStatusBadge />
                        <WfoFailedTasksBadge />
                    </EuiBadgeGroup>

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
