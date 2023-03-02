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
import StatusDotIcon from '../../icons/statusdot.svg';
import LogoutIcon from '../../icons/logout.svg';
import Image from 'next/image';
import { XCircleIcon } from '@heroicons/react/20/solid';

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
    const { theme } = useOrchestratorTheme();

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
                    <EuiBadgeGroup>
                        <HeaderBadge
                            iconType={() => (
                                <Image
                                    color={theme.colors.success}
                                    src={StatusDotIcon}
                                    alt="Engine running logo"
                                    width={24}
                                    height={24}
                                />
                            )}
                            color="emptyShade"
                        >
                            Engine running
                        </HeaderBadge>
                        <HeaderBadge
                            iconType={() => (
                                <XCircleIcon
                                    color={theme.colors.danger}
                                    height={20}
                                    width={20}
                                />
                            )}
                            color="emptyShade"
                        >
                            221
                        </HeaderBadge>
                    </EuiBadgeGroup>

                    <EuiButtonIcon
                        display="empty"
                        iconType={() => (
                            <Image
                                src={LogoutIcon}
                                alt="Orchestrator Logo"
                                width={24}
                                height={24}
                            />
                        )}
                        color="ghost"
                        onClick={() => handleLogoutClick()}
                    />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};
