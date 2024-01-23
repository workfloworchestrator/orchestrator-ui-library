import React from 'react';

import { useOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components/src/hooks';

import { getCopyrightStyles } from './styles';

export const WfoCopyright = () => {
    const { theme } = useOrchestratorTheme();
    const year = new Date().getFullYear();
    const { copyrightStyle } = getCopyrightStyles(theme);

    return (
        <div>
            <span css={copyrightStyle}>
                <p>
                    <a href="https://workfloworchestrator.org/" target="_blank">
                        © {year} - workfloworchestrator.org
                    </a>
                </p>
            </span>
        </div>
    );
};
