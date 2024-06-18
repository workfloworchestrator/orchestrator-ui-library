import React, { FC, Fragment, ReactNode } from 'react';

import { useWithOrchestratorTheme } from '@/hooks';

import { WfoValueCell } from './WfoValueCell';
import { getStyles } from './styles';

export type WfoValueOnlyTableDataType = {
    value: ReactNode;
    textToCopy?: string;
};

export type WfValueOnlyTableProps = {
    values: WfoValueOnlyTableDataType[];
    showCopyToClipboardIcon?: boolean;
};

export const WfoValueOnlyTable: FC<WfValueOnlyTableProps> = ({
    values,
    showCopyToClipboardIcon = false,
}) => {
    const { valueOnlyTable } = useWithOrchestratorTheme(getStyles);

    return (
        <div css={valueOnlyTable}>
            {values.map(({ value, textToCopy }, rowNumber) => (
                <Fragment key={rowNumber}>
                    <WfoValueCell
                        value={value}
                        textToCopy={textToCopy}
                        rowNumber={rowNumber}
                        enableCopyIcon={showCopyToClipboardIcon}
                    />
                </Fragment>
            ))}
        </div>
    );
};
