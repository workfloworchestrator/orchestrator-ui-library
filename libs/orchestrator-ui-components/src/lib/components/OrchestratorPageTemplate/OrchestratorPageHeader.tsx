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
import { HeaderBadge, HeaderBadgeWithLogo } from './HeaderBadge';
import StatusDotIcon from '../../icons/statusdot.svg';
import XCircleFill from '../../icons/x-circle-fill.svg';
import LogoutIcon from '../../icons/logout.svg';
import Image from 'next/image';

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
                        <HeaderBadgeWithLogo
                            logoSrc={StatusDotIcon}
                            logoAlt="Engine running logo"
                            color="emptyShade"
                        >
                            Engine running
                        </HeaderBadgeWithLogo>
                        <HeaderBadgeWithLogo
                            logoSrc={XCircleFill}
                            logoAlt="Error logo"
                            color="emptyShade"
                        >
                            221
                        </HeaderBadgeWithLogo>
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
                        css={{ width: 48, height: 48 }}
                        color="ghost"
                        onClick={() => handleLogoutClick()}
                    />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};
