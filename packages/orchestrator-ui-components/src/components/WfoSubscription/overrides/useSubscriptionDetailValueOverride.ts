import React, { ReactNode } from 'react';

import { useAppSelector } from '@/rtk/hooks';
import { FieldValue } from '@/types';

export type ValueOverrideFunction = (fieldValue: FieldValue) => ReactNode;

export const useSubscriptionDetailValueOverride = () => {
    const valueOverrideConfiguration = useAppSelector(
        (state) =>
            state.orchestratorComponentOverride?.subscriptionDetail
                ?.valueOverrides,
    );

    const getOverriddenValue = (
        fieldValue: FieldValue,
    ): React.ReactNode | null => {
        if (!valueOverrideConfiguration) {
            return null;
        }

        const renderFunctionForField: ValueOverrideFunction | undefined =
            valueOverrideConfiguration[fieldValue.field];

        // This check is needed because TS does not infer the type correctly
        if (renderFunctionForField) {
            return renderFunctionForField(fieldValue);
        }

        return null;
    };

    return {
        getOverriddenValue,
    };
};
