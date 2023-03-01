import React, { FC } from 'react';
import {
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSectionItem,
} from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { IconType } from '@elastic/eui/src/components/icon';

export interface OrchestratorPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    logo: IconType;
    handleLogoutClick: () => void;
}

export const OrchestratorPageHeader: FC<OrchestratorPageHeaderProps> = ({
    navigationHeight,
    logo,
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
            <EuiHeaderSectionItem border="right">
                <EuiHeaderLogo iconType={logo} />
            </EuiHeaderSectionItem>

            <EuiHeaderSectionItem>
                <EuiButtonIcon
                    display="empty"
                    iconType="arrowRight"
                    color="ghost"
                    onClick={() => handleLogoutClick()}
                />
            </EuiHeaderSectionItem>
        </EuiHeader>
    );
};
