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
import { WFOFailedTasksBadge } from '../../WFOBadges/WFOFailedTasksBadge';
import { WFOEngineStatusBadge } from '../../WFOBadges/WFOEngineStatusBadge';
import { WFOEnvironmentBadge } from '../../WFOBadges/WFOEnvironmentBadge';
import { WFOLogoutIcon } from '../../../icons/WFOLogoutIcon';

export interface WFOPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    handleLogoutClick: () => void;
}

export const WFOPageHeader: FC<WFOPageHeaderProps> = ({
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
                    <WFOEnvironmentBadge />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>

            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(2) }}>
                        <WFOEngineStatusBadge />
                        <WFOFailedTasksBadge />
                    </EuiBadgeGroup>

                    <EuiButtonIcon
                        aria-label="Logout"
                        display="empty"
                        iconType={() => (
                            <WFOLogoutIcon color={theme.colors.emptyShade} />
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
