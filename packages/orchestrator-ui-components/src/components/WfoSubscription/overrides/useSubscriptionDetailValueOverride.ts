import React from 'react';

import { ValueOverrideFunction } from '@/rtk';
import { useAppSelector } from '@/rtk/hooks';
import { FieldValue, RenderableFieldValue } from '@/types';

export const useSubscriptionDetailValueOverride = () => {
    const valueOverrideConfiguration = useAppSelector(
        (state) =>
            state.orchestratorComponentOverride?.subscriptionDetail
                ?.valueOverrides,
    );

    const getOverriddenValue = (
        fieldValue: FieldValue | RenderableFieldValue,
        allFieldValues: FieldValue[],
    ): React.ReactNode | null => {
        if (!valueOverrideConfiguration) {
            return null;
        }

        const renderFunctionForField: ValueOverrideFunction | undefined =
            valueOverrideConfiguration[fieldValue.field];

        // This check is needed because TS does not infer the type correctly
        if (renderFunctionForField) {
            return renderFunctionForField(fieldValue, allFieldValues);
        }

        return null;
    };

    return {
        getOverriddenValue,
    };
};
