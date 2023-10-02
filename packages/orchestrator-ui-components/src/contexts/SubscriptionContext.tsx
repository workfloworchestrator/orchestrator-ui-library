import * as React from 'react';
import { ReactNode } from 'react';
import { SubscriptionDetailBase } from '../types';

export type SubscriptionContextType = {
    subscriptionData: SubscriptionDetailBase;
    loadingStatus: number;
    setSubscriptionData: (
        data: SubscriptionDetailBase,
        loadingStatus: number,
    ) => void;
};

const subscriptionDetailInit: SubscriptionDetailBase = {
    subscriptionId: '',
    description: '',
    customerId: '',
    insync: true,
    status: '',
    product: {
        name: '',
        description: '',
        status: '',
        tag: '',
        type: '',
        createdAt: '',
    },
    fixedInputs: {},
    productBlockInstances: [],
};

const InitialSubscriptionContext: SubscriptionContextType = {
    subscriptionData: subscriptionDetailInit,
    loadingStatus: 0,
    setSubscriptionData: () => null,
};

export const SubscriptionContext = React.createContext<SubscriptionContextType>(
    InitialSubscriptionContext,
);

export type SubscriptionProviderProps = {
    children: ReactNode;
};

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
    children,
}) => {
    const [subscriptionData, setInternalSubscriptionData] =
        React.useState<SubscriptionDetailBase>(subscriptionDetailInit);
    const [loadingStatus, setLoadingStatus] = React.useState(0);

    const setSubscriptionData = (
        data: SubscriptionDetailBase,
        loadingStatus: number, // 0 empty 1 outline 2 complete
    ) => {
        setInternalSubscriptionData(data);
        setLoadingStatus(loadingStatus);
    };

    return (
        <SubscriptionContext.Provider
            value={{
                subscriptionData,
                loadingStatus,
                setSubscriptionData,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};
