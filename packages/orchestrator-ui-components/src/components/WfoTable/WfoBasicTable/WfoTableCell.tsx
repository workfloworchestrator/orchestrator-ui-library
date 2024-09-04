import React, { ReactNode, memo } from 'react';

import { EuiToolTip } from '@elastic/eui';

type RenderCellComponentProps<T> = {
    value: T[keyof T];
    record: T;
    showTooltip?: boolean;
    render?: (value: T[keyof T], record: T) => ReactNode;
};

const WfoTableCell = <T extends object>({
    value,
    record,
    showTooltip = false,
    render,
}: RenderCellComponentProps<T>): React.ReactElement => {
    const content = value?.toString() || '';

    if (showTooltip) {
        return (
            <EuiToolTip delay="long" content={content}>
                <>{render ? render(value, record) : value}</>
            </EuiToolTip>
        );
    }

    return render ? <>{render(value, record)}</> : <>{content}</>;
};

export default memo(WfoTableCell);
