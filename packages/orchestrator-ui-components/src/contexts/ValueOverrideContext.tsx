import React, { FC, ReactNode, createContext, useContext } from 'react';

import { FieldValue } from '@/types';

export type ValueOverrideFunction = (fieldValue: FieldValue) => ReactNode;

export type ValueOverrideConfiguration = Record<string, ValueOverrideFunction>;

export type ValueOverrideContextType = {
    valueOverride?: (fieldValue: FieldValue) => ReactNode | null;
};

export const ValueOverrideContext = createContext<ValueOverrideContextType>({});

export type ValueOverrideProviderProps = {
    valueOverrideConfiguration?: ValueOverrideConfiguration;
    children: ReactNode;
};

/**
 * Accepts a configuration object that contains keys to be overridden and a function that renders the value.
 * @param valueOverrideConfiguration configuration object to override values
 * @param children the child components that can use the useValueOverride hook
 */
export const ValueOverrideProvider: FC<ValueOverrideProviderProps> = ({
    valueOverrideConfiguration,
    children,
}) => {
    const getRenderedValue = (
        fieldValue: FieldValue,
    ): React.ReactNode | null => {
        if (!valueOverrideConfiguration) {
            return null;
        }

        const renderFunctionForField: ValueOverrideFunction | undefined =
            valueOverrideConfiguration[fieldValue.field];

        // This check is needed TS does not infer the type correctly
        if (renderFunctionForField) {
            return renderFunctionForField(fieldValue);
        }

        return null;
    };

    return (
        <ValueOverrideContext.Provider
            value={{ valueOverride: getRenderedValue }}
        >
            {children}
        </ValueOverrideContext.Provider>
    );
};

/**
 * This hook exposes a overrideValueRender function. It can be used to optionally override values in key-value tables
 * @param valueOverride a function that takes a key and value and returns a ReactNode when the value should be overridden. It returns null if the value should not be overridden
 */
export const useValueOverride = () => useContext(ValueOverrideContext);
