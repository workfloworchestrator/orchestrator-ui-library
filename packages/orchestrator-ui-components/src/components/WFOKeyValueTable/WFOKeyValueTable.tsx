import React, { FC, ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';

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
});

export type WFOKeyValueTableDataType = {
    key: string;
    value: ReactNode | string;
};

export type WFOKeyValueTableProps = {
    keyValues: WFOKeyValueTableDataType[]; // try to make the table config map to this datatype -- key: string, render: () => ReactNode
};

export const WFOKeyValueTable: FC<WFOKeyValueTableProps> = ({ keyValues }) => {
    return (
        <table width="100%">
            <tbody>
                {keyValues.map(({ key, value }, i) => (
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
                        {/*Placeholder for copy button*/}
                        <td css={copyColumnStyle}>[C]</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
