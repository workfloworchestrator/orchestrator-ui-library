import React, { FC } from 'react';

import {
    OrchestratorConfig,
    OrchestratorConfigProvider,
} from '@/contexts/ConfigContext';

export type AppProvidersProps = {
    children: React.ReactNode;
    initialOrchestratorConfig: OrchestratorConfig;
};

export const AppProviders: FC<AppProvidersProps> = ({
    initialOrchestratorConfig,
    children,
}) => {
    return (
        <OrchestratorConfigProvider
            initialOrchestratorConfig={initialOrchestratorConfig}
        >
            {children}
        </OrchestratorConfigProvider>
    );
};
