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
import { WfoFailedTasksBadge } from '../../WfoBadges/WfoFailedTasksBadge';
import { WfoEngineStatusBadge } from '../../WfoBadges/WfoEngineStatusBadge';
import { WfoEnvironmentBadge } from '../../WfoBadges/WfoEnvironmentBadge';
import { WfoLogoutIcon } from '../../../icons/WfoLogoutIcon';

export interface WfoPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    handleLogoutClick: () => void;
}

export const WfoPageHeader: FC<WfoPageHeaderProps> = ({
    navigationHeight,
    getAppLogo,
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
                        css={{ width: 48, height: 48 }}
                        color="ghost"
                        onClick={() => handleLogoutClick()}
                    />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};
