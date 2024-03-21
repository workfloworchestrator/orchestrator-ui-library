import React, { FC, ReactNode, createContext, useContext } from 'react';

import { FieldValue } from '@/types';

export type OverrideValueRenderFunction = (
    key: string,
    value: FieldValue['value'],
) => ReactNode | null;

export type ValueRenderContextType = {
    overrideValueRender?: OverrideValueRenderFunction;
};

export const OverrideValueRenderContext = createContext<ValueRenderContextType>(
    {},
);

export type OverrideValueRenderProviderProps = {
    overrideValueRender?: OverrideValueRenderFunction;
    children: ReactNode;
};

/**
 * Provides an optional overrideValueRender function to override the values in key-value tables
 * @param overrideValueRender receives the key and value and returns a ReactNode. It should return null if the value should not be overridden
 * @param children the child components that can use the useOverrideValueRender hook
 */
export const OverrideValueRenderProvider: FC<
    OverrideValueRenderProviderProps
> = ({ overrideValueRender, children }) => (
    <OverrideValueRenderContext.Provider
        value={{ overrideValueRender: overrideValueRender }}
    >
        {children}
    </OverrideValueRenderContext.Provider>
);

/**
 * This hook exposes a overrideValueRender function. It can be used to optionally override values in key-value tables
 * @param overrideValueRender a function that takes a key and value and returns a ReactNode when the value should be overridden. It returns null if the value should not be overridden
 */
export const useOverrideValueRender = () =>
    useContext(OverrideValueRenderContext);
