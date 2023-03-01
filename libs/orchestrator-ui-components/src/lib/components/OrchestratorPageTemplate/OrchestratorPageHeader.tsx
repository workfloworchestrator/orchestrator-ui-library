import React, { FC, ReactElement } from 'react';
import {
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSectionItem,
} from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';

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
            <EuiHeaderSectionItem border="right">
                <EuiHeaderLogo iconType={() => getAppLogo(navigationHeight)} />
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
