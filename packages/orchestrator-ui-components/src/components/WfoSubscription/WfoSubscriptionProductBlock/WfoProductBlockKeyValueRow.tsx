import React, { FC } from 'react';

import { EuiBadge } from '@elastic/eui';

import { useValueOverride } from '@/contexts';
import { useWithOrchestratorTheme } from '@/hooks';
import { FieldValue } from '@/types';
import { camelToHuman } from '@/utils';

import { getStyles } from './styles';

export type WfoProductBlockKeyValueRowProps = {
    fieldValue: FieldValue;
};

export const WfoProductBlockKeyValueRow: FC<
    WfoProductBlockKeyValueRowProps
> = ({ fieldValue }) => {
    const {
        productBlockLeftColStyle,
        productBlockRightColStyle,
        productBlockRowStyle,
    } = useWithOrchestratorTheme(getStyles);
    const { valueOverride } = useValueOverride();

    const { field, value } = fieldValue;

    const WfoProductBlockValue: FC<{ value: FieldValue['value'] }> = ({
        value,
    }) =>
        typeof value === 'boolean' ? (
            <EuiBadge>{value.toString()}</EuiBadge>
        ) : (
            <>{value}</>
        );

    return (
        <tr css={productBlockRowStyle}>
            <td css={productBlockLeftColStyle}>
                <b>{camelToHuman(field)}</b>
            </td>
            <td css={productBlockRightColStyle}>
                {valueOverride?.(fieldValue) ?? (
                    <WfoProductBlockValue value={value} />
                )}
            </td>
        </tr>
    );
};
