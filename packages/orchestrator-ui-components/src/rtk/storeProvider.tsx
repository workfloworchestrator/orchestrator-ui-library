import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import type { ComponentMatcher } from 'pydantic-forms';

import { emptyOrchestratorConfig } from '@/contexts';
import { CustomApiConfig } from '@/rtk/slices/customApis';
import { OrchestratorComponentOverride } from '@/rtk/slices/orchestratorComponentOverride';
import type { OrchestratorConfig } from '@/types';

import { getOrchestratorStore } from './store';

export type StoreProviderProps = {
    initialOrchestratorConfig: OrchestratorConfig | null;
    orchestratorComponentOverride?: OrchestratorComponentOverride;
    componentMatcher?: ComponentMatcher;
    customApis?: CustomApiConfig[];
    children: ReactNode;
};

export const StoreProvider = ({
    initialOrchestratorConfig,
    orchestratorComponentOverride,
    componentMatcher,
    customApis = [],
    children,
}: StoreProviderProps) => {
    const store = getOrchestratorStore({
        orchestratorConfig:
            initialOrchestratorConfig ?? emptyOrchestratorConfig,
        orchestratorComponentOverride,
        pydanticForm: {
            componentMatcher: componentMatcher || undefined,
        },
        customApis,
    });
    const [orchestratorStore] = useState(store);

    return <Provider store={orchestratorStore}>{children}</Provider>;
};
