import React, { FC } from 'react';
import {
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSectionItem,
    EuiText,
} from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';

export interface OrchestratorPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    handleLogoutClick: () => void;
}

export const OrchestratorPageHeader: FC<OrchestratorPageHeaderProps> = ({
    navigationHeight,
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
                <EuiHeaderLogo>
                    <EuiText color={theme.colors.emptyShade}>
                        Orchestrator
                    </EuiText>
                </EuiHeaderLogo>
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
