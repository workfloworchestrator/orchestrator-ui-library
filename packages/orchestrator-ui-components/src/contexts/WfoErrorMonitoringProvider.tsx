import React, { FC, ReactNode, createContext } from 'react';

export type WfoErrorMonitoring = {
    reportError: (error: Error | string) => void;
    reportMessage: (message: string) => void;
};

export const emptyWfoErrorMonitoring: WfoErrorMonitoring = {
    reportError: () => {},
    reportMessage: () => {},
};

export const WfoErrorMonitoringContext = createContext<WfoErrorMonitoring>(
    emptyWfoErrorMonitoring,
);

export type WfoErrorMonitoringProviderProps = {
    errorMonitoringHandler?: WfoErrorMonitoring;
    children: ReactNode;
};

/**
 *
 * @param errorMonitoringHandler for implementing the error monitoring. When not provided, all report calls are no-ops.
 * @param children
 */
export const WfoErrorMonitoringProvider: FC<
    WfoErrorMonitoringProviderProps
> = ({ errorMonitoringHandler, children }) => {
    return (
        <WfoErrorMonitoringContext.Provider
            value={errorMonitoringHandler ?? emptyWfoErrorMonitoring}
        >
            {children}
        </WfoErrorMonitoringContext.Provider>
    );
};
