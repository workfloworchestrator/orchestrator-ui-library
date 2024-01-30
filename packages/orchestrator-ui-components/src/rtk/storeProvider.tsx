import React, { useState } from 'react';
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
    const store = getOrchestratorStore(initialOrchestratorConfig);
    const [orchestratorStore] = useState(store);

    return <Provider store={orchestratorStore}>{children}</Provider>;
};
