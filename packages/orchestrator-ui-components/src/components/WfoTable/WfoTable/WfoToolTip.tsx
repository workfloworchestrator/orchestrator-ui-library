import React, { FC, ReactNode } from 'react';

import { EuiToolTip } from '@elastic/eui';

interface WfoToolTipProps {
    tooltipContent: ReactNode;
    children: ReactNode;
    className?: string;
}

export const WfoToolTip: FC<WfoToolTipProps> = ({
    tooltipContent,
    children,
    className,
}) => {
    return (
        <EuiToolTip
            className={className}
            position="bottom"
            delay="long"
            content={tooltipContent}
            css={{ maxWidth: 'fit-content' }}
            repositionOnScroll
        >
            <div css={{ width: '100%' }}>{children}</div>
        </EuiToolTip>
    );
};
