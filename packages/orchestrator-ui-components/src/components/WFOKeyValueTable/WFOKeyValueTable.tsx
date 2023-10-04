import React, { FC, Fragment, ReactNode } from 'react';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';
import { WFOKeyCell } from './WFOKeyCell';
import { WFOValueCell } from './WFOValueCell';

export type WFOKeyValueTableDataType = {
    key: string;
    value: ReactNode;
    textToCopy?: string;
};

export type WFOKeyValueTableProps = {
    keyValues: WFOKeyValueTableDataType[];
    showCopyToClipboardIcon?: boolean;
};

export const WFOKeyValueTable: FC<WFOKeyValueTableProps> = ({
    keyValues,
    showCopyToClipboardIcon = false,
}) => {
    const { theme } = useOrchestratorTheme();
    const { keyValueTable } = getStyles(theme);

    return (
        <div css={keyValueTable}>
            {keyValues.map(({ key, value, textToCopy }, rowNumber) => (
                <Fragment key={key}>
                    <WFOKeyCell value={key} rowNumber={rowNumber} />
                    <WFOValueCell
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
