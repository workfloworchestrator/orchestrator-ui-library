import React, { ReactNode } from 'react';

import { EuiToolTip } from '@elastic/eui';

interface WfoDataCellProps {
    showTooltip: boolean;
    content: ReactNode;
    children: ReactNode;
}

export const WfoDataCell = ({
    showTooltip,
    content,
    children,
}: WfoDataCellProps) => {
    return showTooltip ? (
        <EuiToolTip delay="long" content={content}>
            <>{children}</>
        </EuiToolTip>
    ) : (
        <>{children}</>
    );
};
