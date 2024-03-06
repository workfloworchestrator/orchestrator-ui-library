import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { CustomBaseQuery } from '@/rtk/slices/customBaseQueries';
import type { OrchestratorConfig } from '@/types';

import { getOrchestratorStore } from './store';

export type StoreProviderProps = {
    initialOrchestratorConfig: OrchestratorConfig;
    customBaseQueries?: CustomBaseQuery[];
    children: ReactNode;
};

export const StoreProvider = ({
    initialOrchestratorConfig,
    customBaseQueries,
    children,
}: StoreProviderProps) => {
    const store = getOrchestratorStore(
        initialOrchestratorConfig,
        customBaseQueries,
    );
    const [orchestratorStore] = useState(store);

    return <Provider store={orchestratorStore}>{children}</Provider>;
};
