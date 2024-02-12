import React, { FC, ReactNode, createContext, useCallback } from 'react';

export type Policy = {
    isAllowed: (routerPath: string, resource?: string) => boolean;
};

export const PolicyContext = createContext<Policy>({ isAllowed: () => true });

export type PolicyProviderProps = {
    initialIsAllowed: (routerPath: string, resource?: string) => boolean;
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
