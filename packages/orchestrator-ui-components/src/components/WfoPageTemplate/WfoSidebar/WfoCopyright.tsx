import React from 'react';

import { useWithOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components/src/hooks';

import { getCopyrightStyles } from './styles';

export const WfoCopyright = () => {
    const { copyrightStyle } = useWithOrchestratorTheme(getCopyrightStyles);
    const year = new Date().getFullYear();

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
