import React, { FC, ReactNode } from 'react';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';
import { WFOKeyCell } from './WFOKeyCell';
import { WFOValueCell } from './WFOValueCell';

export type WFOKeyValueTableDataType = {
    key: string;
    value: ReactNode;
    plainTextValue?: string;
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
            {keyValues.map(({ key, value, plainTextValue }, rowNumber) => (
                <>
                    <WFOKeyCell value={key} rowNumber={rowNumber} />
                    <WFOValueCell
                        value={value}
                        plainTextValue={plainTextValue}
                        rowNumber={rowNumber}
                        enableCopyIcon={showCopyToClipboardIcon}
                    />
                </>
            ))}
        </div>
    );
};
