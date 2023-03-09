import React, { FC, ReactElement } from 'react';
import {
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSectionItem,
    EuiHeaderSection,
    EuiBadgeGroup,
} from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { HeaderBadge } from './HeaderBadge';
import { StatusDotIcon } from '../../icons/StatusDotIcon';
import { XCircleFill } from '../../icons/XCircleFill';
import { LogoutIcon } from '../../icons/LogoutIcon';
import { useEngineStatus } from '../../hooks/useEngineStatus';

export interface OrchestratorPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    handleLogoutClick: () => void;
}

export const OrchestratorPageHeader: FC<OrchestratorPageHeaderProps> = ({
    navigationHeight,
    getAppLogo,
    handleLogoutClick,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();

    const { isLoading, error, data } = useEngineStatus();
    console.log({ isLoading, error, data: data });

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
                    <HeaderBadge color="warning">Development</HeaderBadge>
                </EuiHeaderSectionItem>
            </EuiHeaderSection>

            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(2) }}>
                        <HeaderBadge
                            color="emptyShade"
                            iconType={() => (
                                <StatusDotIcon color={theme.colors.success} />
                            )}
                        >
                            Engine {data?.global_status}
                        </HeaderBadge>

                        <HeaderBadge
                            color="emptyShade"
                            iconType={() => (
                                <XCircleFill color={theme.colors.danger} />
                            )}
                        >
                            221
                        </HeaderBadge>
                    </EuiBadgeGroup>

                    <EuiButtonIcon
                        aria-label="Logout"
                        display="empty"
                        iconType={() => (
                            <LogoutIcon color={theme.colors.emptyShade} />
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
