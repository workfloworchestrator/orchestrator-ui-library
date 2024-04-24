import React, { FC, Fragment, ReactNode } from 'react';

import { useWithOrchestratorTheme } from '@/hooks';

import { WfoKeyCell } from './WfoKeyCell';
import { WfoValueCell } from './WfoValueCell';
import { getStyles } from './styles';

export type WfoKeyValueTableDataType = {
    key: string;
    value: ReactNode;
    textToCopy?: string;
};

export type WfoKeyValueTableProps = {
    keyValues: WfoKeyValueTableDataType[];
    showCopyToClipboardIcon?: boolean;
};

export const WfoKeyValueTable: FC<WfoKeyValueTableProps> = ({
    keyValues,
    showCopyToClipboardIcon = false,
}) => {
    const { keyValueTable } = useWithOrchestratorTheme(getStyles);

    return (
        <div css={keyValueTable}>
            {keyValues.map(({ key, value, textToCopy }, rowNumber) => (
                <Fragment key={key}>
                    <WfoKeyCell value={key} rowNumber={rowNumber} />
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
