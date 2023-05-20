import * as React from 'react';
import { ReactNode } from 'react';

export type SubscriptionContextType<T> = {
    subscriptionData: T; // Todo: use a valid SubscriptionDetailBase here with enough flexibility to extend?
    loadingStatus: number;
    setSubscriptionData: (data: T, loadingStatus: number) => void; // Todo: here too
};

// Todo: revisit when we have a generic representation of a subscription
export const SubscriptionContext =
    React.createContext<SubscriptionContextType<any> | null>(null);

export type SubscriptionProviderProps = {
    children: ReactNode;
};

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
    children,
}) => {
    const [subscriptionData, setInteralSubscriptionData] = React.useState({});
    const [loadingStatus, setLoadingStatus] = React.useState(0);

    const setSubscriptionData = (data, loadingStatus: number) => {
        setInteralSubscriptionData(data);
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
