import * as React from 'react';
import { ReactNode } from 'react';

export type SubscriptionContextType = {
    subscriptionData: any; // Todo: use a valid SubscriptionDetailBase here with enough flexibility to extend?
    loadingStatus: number;
    setSubscriptionData: (data: any, loadingStatus) => void; // Todo: here too
};

export const SubscriptionContext =
    React.createContext<SubscriptionContextType | null>(null);

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
