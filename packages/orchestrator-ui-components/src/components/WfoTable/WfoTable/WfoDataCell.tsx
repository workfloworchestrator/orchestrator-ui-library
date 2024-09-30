import React, { FC, ReactNode } from 'react';

import { EuiToolTip } from '@elastic/eui';

interface WfoDataCellProps {
    customTooltip: ReactNode;
    children: ReactNode;
}

export const WfoDataCell: FC<WfoDataCellProps> = ({
    customTooltip,
    children,
}) => {
    const tooltipContent =
        customTooltip || (typeof children === 'string' ? children : <></>);

    if (tooltipContent) {
        return (
            <EuiToolTip
                position="bottom"
                delay="long"
                content={tooltipContent}
                css={{ maxWidth: 'fit-content' }}
                repositionOnScroll
            >
                <>{children}</>
            </EuiToolTip>
        );
    }
    return <>{children}</>;
};
