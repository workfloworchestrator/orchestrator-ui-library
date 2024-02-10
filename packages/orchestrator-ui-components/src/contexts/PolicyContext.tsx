import React, { FC, ReactNode, createContext, useCallback } from 'react';

export type Policy = {
    isAllowed: (resource: string, routerPath: string) => boolean;
};

export const PolicyContext = createContext<Policy>({ isAllowed: () => true });

export type PolicyProviderProps = {
    initialIsAllowed: (resource: string, routerPath: string) => boolean;
    children: ReactNode;
};

export const PolicyContextProvider: FC<PolicyProviderProps> = ({
    initialIsAllowed,
    children,
}) => {
    const isAllowed = useCallback(initialIsAllowed, [initialIsAllowed]);

    return (
        <PolicyContext.Provider value={{ isAllowed }}>
            {children}
        </PolicyContext.Provider>
    );
};
