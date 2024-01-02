import React, { ReactElement } from 'react';

import { EuiText } from '@elastic/eui';
import { useOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

import { getAppLogoStyles } from '@/components/AppLogo/styles';

export function getAppLogo(): ReactElement {
    const { logoStyle } = getAppLogoStyles();

    const AppLogo = () => {
        const { theme } = useOrchestratorTheme();

        return (
            <div css={logoStyle}>
                <EuiText color={theme.colors.emptyShade} size="xs">
                    Workflow
                </EuiText>
                <EuiText color={theme.colors.emptyShade} size="xs">
                    Orchestrator
                </EuiText>
            </div>
        );
    };

    return <AppLogo />;
}
