import React, { FC, ReactElement } from 'react';

import {
    EuiBadgeGroup,
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSection,
    EuiHeaderSectionItem,
} from '@elastic/eui';

import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WfoLogoutIcon } from '../../../icons/WfoLogoutIcon';
import { WfoEngineStatusBadge } from '../../WfoBadges/WfoEngineStatusBadge';
import { WfoEnvironmentBadge } from '../../WfoBadges/WfoEnvironmentBadge';
import { WfoFailedTasksBadge } from '../../WfoBadges/WfoFailedTasksBadge';

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
    return (
        <EuiHeader
            css={{
                backgroundColor: theme.colors.primary,
                height: navigationHeight,
            }}
        >
            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiHeaderLogo
                        iconType={() => getAppLogo(navigationHeight)}
                    />
                </EuiHeaderSectionItem>
                <EuiHeaderSectionItem>
                    <WfoEnvironmentBadge />
                </EuiHeaderSectionItem>

                <EuiButtonIcon
                    aria-label="Logout"
                    display="empty"
                    iconType={() => (
                        <WfoLogoutIcon color={theme.colors.emptyShade} />
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
