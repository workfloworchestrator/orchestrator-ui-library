import React, { FC, ReactNode } from 'react';
import { WFOClipboardCopy } from '../../icons/WFOClipboardCopy';
import { EuiCopy } from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';

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

type WFOKeyCellProps = {
    value: string;
    rowNumber: number;
};
const WFOKeyCell: FC<WFOKeyCellProps> = ({ value, rowNumber }) => {
    const { theme } = useOrchestratorTheme();
    const { keyColumnStyle, getBackgroundColorStyleForRow } = getStyles(theme);

    return (
        <div css={[getBackgroundColorStyleForRow(rowNumber), keyColumnStyle]}>
            <b>{value}</b>
        </div>
    );
};

type WFOValueCellProps = {
    value: ReactNode;
    plainTextValue?: string;
    rowNumber: number;
    enableCopyIcon: boolean;
};

const WFOValueCell: FC<WFOValueCellProps> = ({
    value,
    plainTextValue,
    rowNumber,
    enableCopyIcon,
}) => {
    const { theme } = useOrchestratorTheme();
    const {
        valueColumnStyle,
        clipboardIconStyle,
        clickable,
        getBackgroundColorStyleForRow,
    } = getStyles(theme);

    const shouldRenderCopyColumn = enableCopyIcon && plainTextValue;

    return (
        <div css={[getBackgroundColorStyleForRow(rowNumber), valueColumnStyle]}>
            <div>{value}</div>
            <div css={clipboardIconStyle}>
                {shouldRenderCopyColumn && (
                    <EuiCopy textToCopy={plainTextValue}>
                        {(copy) => (
                            <div onClick={copy} css={clickable}>
                                <WFOClipboardCopy
                                    width={16}
                                    height={16}
                                    color={theme.colors.mediumShade}
                                />
                            </div>
                        )}
                    </EuiCopy>
                )}
            </div>
        </div>
    );
};
