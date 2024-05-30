import React, { FC } from 'react';

import { EuiBadge } from '@elastic/eui';

import { useSubscriptionDetailValueOverride } from '@/components';
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
    const { leftColumnStyle, rowStyle } = useWithOrchestratorTheme(getStyles);
    const { getOverriddenValue } = useSubscriptionDetailValueOverride();

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
        <tr css={rowStyle}>
            <td css={leftColumnStyle}>
                <b>{camelToHuman(field)}</b>
            </td>
            <td>
                {getOverriddenValue(fieldValue) ?? (
                    <WfoProductBlockValue value={value} />
                )}
            </td>
        </tr>
    );
};
