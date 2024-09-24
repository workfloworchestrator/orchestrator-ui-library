import React, { ReactNode } from 'react';

import { EuiToolTip } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

interface WfoDataCellProps {
    tooltipContent: ReactNode;
    children: ReactNode;
}

export const WfoDataCell = ({ tooltipContent, children }: WfoDataCellProps) => {
    const { theme } = useOrchestratorTheme();
    return tooltipContent ? (
        <EuiToolTip
            delay="long"
            content={tooltipContent}
            css={{ minWidth: theme.base * 20 }}
            repositionOnScroll
        >
            <div css={{ width: '100%' }}>{children}</div>
        </EuiToolTip>
    ) : (
        <>{children}</>
    );
};
