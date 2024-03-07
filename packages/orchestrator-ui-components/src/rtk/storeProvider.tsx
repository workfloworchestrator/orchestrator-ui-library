import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { CustomApiConfig } from '@/rtk/slices/customApis';
import type { OrchestratorConfig } from '@/types';

import { getOrchestratorStore } from './store';

export type StoreProviderProps = {
    initialOrchestratorConfig: OrchestratorConfig;
    customApis?: CustomApiConfig[];
    children: ReactNode;
};

export const StoreProvider = ({
    initialOrchestratorConfig,
    customApis = [],
    children,
}: StoreProviderProps) => {
    const store = getOrchestratorStore(initialOrchestratorConfig, customApis);
    const [orchestratorStore] = useState(store);

    return <Provider store={orchestratorStore}>{children}</Provider>;
};
