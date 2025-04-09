import React, { FC } from 'react';

import { EuiBadge } from '@elastic/eui';

import { useSubscriptionDetailValueOverride } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { FieldValue, RenderableFieldValue } from '@/types';
import { camelToHuman } from '@/utils';

import { getStyles } from './styles';

export type WfoProductBlockKeyValueRowProps = {
    fieldValue: FieldValue | RenderableFieldValue;
    allFieldValues: FieldValue[];
};

export const WfoProductBlockKeyValueRow: FC<
    WfoProductBlockKeyValueRowProps
> = ({ fieldValue, allFieldValues }) => {
    const { leftColumnStyle, rowStyle } = useWithOrchestratorTheme(getStyles);
    const { getOverriddenValue } = useSubscriptionDetailValueOverride();

    const { field, value } = fieldValue;

    const WfoProductBlockValue: FC<{
        value: RenderableFieldValue['value'];
    }> = ({ value }) => {
        if (typeof value === 'boolean') {
            return <EuiBadge>{value.toString()}</EuiBadge>;
        } else if (Array.isArray(value)) {
            const result = value.join(', ');
            return <>{result}</>;
        } else {
            return <>{value}</>;
        }
    };

    return (
        <tr css={rowStyle}>
            <td css={leftColumnStyle}>
                <b>{camelToHuman(field)}</b>
            </td>
            <td>
                {getOverriddenValue(fieldValue, allFieldValues) ?? (
                    <WfoProductBlockValue value={value} />
                )}
            </td>
        </tr>
    );
};
