import React, { FC, ReactNode, createContext } from 'react';

export type Policy = {
    isAllowedHandler: (routerPath: string, resource?: string) => boolean;
};

export const PolicyContext = createContext<Policy>({
    isAllowedHandler: () => true,
});

export type PolicyProviderProps = {
    isAllowedHandler: (routerPath: string, resource?: string) => boolean;
    children: ReactNode;
};

export const PolicyContextProvider: FC<PolicyProviderProps> = ({
    isAllowedHandler,
    children,
}) => (
    <PolicyContext.Provider value={{ isAllowedHandler }}>
        {children}
    </PolicyContext.Provider>
);
