import React, { FC, ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { WFOClipboardCopy } from '../../icons/WFOClipboardCopy';
import { EuiCopy } from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks';

// Todo: use theme hook!
export const keyColumnStyle: SerializedStyles = css({
    minWidth: 'fit-content',
    paddingLeft: 10,
    paddingRight: 100,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
});
export const valueColumnStyle: SerializedStyles = css({
    padding: 10,
});

export const copyColumnStyle: SerializedStyles = css({
    padding: 10,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    verticalAlign: 'middle',
});

export const clickable: SerializedStyles = css({
    cursor: 'pointer',
});

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

    return (
        <table width="100%">
            <tbody>
                {keyValues.map(({ key, value, plainTextValue }, i) => {
                    const shouldRenderCopyColumn =
                        showCopyToClipboardIcon && plainTextValue;
                    return (
                        <tr
                            key={key}
                            style={{
                                backgroundColor: i % 2 ? '#FFF' : '#F1F5F9',
                            }}
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
