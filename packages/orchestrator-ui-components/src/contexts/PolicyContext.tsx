import React, {
    FC,
    ReactNode,
    createContext,
    useCallback,
    useContext,
} from 'react';

export type Policy = {
    isAllowed: (resource: string) => boolean;
};

export const PolicyContext = createContext<Policy>({ isAllowed: () => true });

export type PolicyProviderProps = {
    initialIsAllowed: (resource: string) => boolean;
    children: ReactNode;
};

export const PolicyContextProvider: FC<PolicyProviderProps> = ({
    initialIsAllowed,
    children,
}) => {
    const isAllowed = useCallback(
        (resource: string) => initialIsAllowed(resource),
        [initialIsAllowed],
    );

    return (
        <PolicyContext.Provider value={{ isAllowed }}>
            {children}
        </PolicyContext.Provider>
    );
};

export const usePolicy = () => useContext(PolicyContext);
