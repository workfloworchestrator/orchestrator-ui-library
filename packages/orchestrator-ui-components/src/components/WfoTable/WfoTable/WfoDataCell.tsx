import React, { ReactNode } from 'react';

import { EuiToolTip } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

interface WfoDataCellProps {
    content: ReactNode;
    children: ReactNode;
}

export const WfoDataCell = ({ content, children }: WfoDataCellProps) => {
    const { theme } = useOrchestratorTheme();
    return content ? (
        <EuiToolTip
            delay="long"
            content={content}
            css={{ minWidth: theme.base * 20 }}
            repositionOnScroll
        >
            <div css={{ width: '100%' }}>{children}</div>
        </EuiToolTip>
    ) : (
        <>{children}</>
    );
};
