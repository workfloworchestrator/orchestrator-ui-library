import React, { ReactNode, memo } from 'react';

import { EuiToolTip } from '@elastic/eui';

type RenderCellComponentProps = {
    showTooltip: boolean;
    content: ReactNode;
    children: ReactNode;
};

const WfoDataCell = ({
    showTooltip,
    content,
    children,
}: RenderCellComponentProps): React.ReactElement => {
    if (showTooltip) {
        return (
            <EuiToolTip delay="long" content={content}>
                <>{children}</>
            </EuiToolTip>
        );
    } else {
        return <>{children}</>;
    }
};

export default memo(WfoDataCell);
