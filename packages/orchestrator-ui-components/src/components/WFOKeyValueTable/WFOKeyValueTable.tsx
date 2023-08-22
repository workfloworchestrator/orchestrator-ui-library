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
        copyColumnStyle,
        clickable,
        lightBackground,
        darkBackground,
    } = getStyles(theme);

    return (
        <table width="100%">
            <tbody>
                {keyValues.map(({ key, value, plainTextValue }, rowNumber) => {
                    const shouldRenderCopyColumn =
                        showCopyToClipboardIcon && plainTextValue;
                    return (
                        <tr
                            key={key}
                            css={
                                rowNumber % 2 ? lightBackground : darkBackground
                            }
                        >
                            <td valign={'top'} css={keyColumnStyle}>
                                <b>{key}</b>
                            </td>
                            <td css={valueColumnStyle}>{value}</td>
                            <td
                                css={[
                                    copyColumnStyle,
                                    shouldRenderCopyColumn && clickable,
                                ]}
                            >
                                {shouldRenderCopyColumn && (
                                    <EuiCopy textToCopy={plainTextValue}>
                                        {(copy) => (
                                            <div onClick={copy}>
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
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
