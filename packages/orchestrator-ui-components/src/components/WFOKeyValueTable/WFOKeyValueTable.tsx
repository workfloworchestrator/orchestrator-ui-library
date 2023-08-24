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
    const {
        keyColumnStyle,
        valueColumnStyle,
        clipboardIconStyle,
        clickable,
        keyValueTable,
        getBackgroundColorStyleForRow,
    } = getStyles(theme);
    return (
        <div css={keyValueTable}>
            {keyValues.map(({ key, value, plainTextValue }, rowNumber) => {
                const shouldRenderCopyColumn =
                    showCopyToClipboardIcon && plainTextValue;
                return (
                    <>
                        <div
                            css={[
                                getBackgroundColorStyleForRow(rowNumber),
                                keyColumnStyle,
                            ]}
                        >
                            <b>{key}</b>
                        </div>
                        <div
                            css={[
                                getBackgroundColorStyleForRow(rowNumber),
                                valueColumnStyle,
                            ]}
                        >
                            <div>{value}</div>
                            <div css={clipboardIconStyle}>
                                {shouldRenderCopyColumn && (
                                    <EuiCopy textToCopy={plainTextValue}>
                                        {(copy) => (
                                            <div onClick={copy} css={clickable}>
                                                <WFOClipboardCopy
                                                    width={16}
                                                    height={16}
                                                    color={
                                                        theme.colors.mediumShade
                                                    }
                                                />
                                            </div>
                                        )}
                                    </EuiCopy>
                                )}
                            </div>
                        </div>
                    </>
                );
            })}
        </div>
    );
};
