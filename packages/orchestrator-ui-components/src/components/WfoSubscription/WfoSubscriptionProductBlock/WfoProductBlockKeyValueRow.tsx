import React, { FC } from 'react';

import { EuiBadge } from '@elastic/eui';

import { ValueOverrideFunction, useValueOverride } from '@/contexts';
import { useWithOrchestratorTheme } from '@/hooks';
import { useAppSelector } from '@/rtk/hooks';
import { FieldValue } from '@/types';
import { camelToHuman } from '@/utils';

import { getStyles } from './styles';

export type WfoProductBlockKeyValueRowProps = {
    fieldValue: FieldValue;
};

export const WfoProductBlockKeyValueRow: FC<
    WfoProductBlockKeyValueRowProps
> = ({ fieldValue }) => {
    const { leftColumnStyle, rightColumnStyle, rowStyle } =
        useWithOrchestratorTheme(getStyles);
    const { valueOverride } = useValueOverride();

    // START ------ Get data from store
    const valueOverride2 = useAppSelector(
        (state) =>
            state.orchestratorComponentOverride?.subscriptionDetail
                ?.valueOverrides,
    );

    // Should be placed in a hook
    const getRenderedValue = (
        fieldValue: FieldValue,
    ): React.ReactNode | null => {
        if (!valueOverride2) {
            return null;
        }

        const renderFunctionForField: ValueOverrideFunction | undefined =
            valueOverride2[fieldValue.field];

        // This check is needed because TS does not infer the type correctly
        if (renderFunctionForField) {
            return renderFunctionForField(fieldValue);
        }

        return null;
    };

    /////// END

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
            <td css={rightColumnStyle}>
                {valueOverride?.(fieldValue) ?? (
                    <WfoProductBlockValue value={value} />
                )}
            </td>
            {/* Todo Temporary copy of previous col to compare solutions */}
            <td css={rightColumnStyle}>
                {getRenderedValue?.(fieldValue) ?? (
                    <WfoProductBlockValue value={value} />
                )}
            </td>
        </tr>
    );
};
