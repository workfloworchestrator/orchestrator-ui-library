import React, {
    FC,
    ReactNode,
    createContext,
    useCallback,
    useContext,
} from 'react';

import { useRouter } from 'next/router';

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
    const isAllowed = useCallback(
        (resource: string, routerPath: string) =>
            initialIsAllowed(resource, routerPath),
        [initialIsAllowed],
    );

    return (
        <PolicyContext.Provider value={{ isAllowed }}>
            {children}
        </PolicyContext.Provider>
    );
};

export const usePolicy = () => {
    const { isAllowed } = useContext(PolicyContext);
    const router = useRouter();

    return {
        isAllowed: (resource: string) => isAllowed(resource, router.asPath),
    };
};
