import React from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { useOrchestratorConfig } from '@/hooks';
import type { OrchestratorConfig } from '@/types';

import { getOrchestratorStore } from './store';

export type StoreProviderProps = {
    initialOrchestratorConfig: OrchestratorConfig;
    children: ReactNode;
};

export const StoreProvider = ({
    initialOrchestratorConfig,
    children,
}: StoreProviderProps) => {
    const { orchestratorConfig } = useOrchestratorConfig(
        initialOrchestratorConfig,
    );

    const store = getOrchestratorStore(orchestratorConfig);

    return <Provider store={store}>{children}</Provider>;
};
