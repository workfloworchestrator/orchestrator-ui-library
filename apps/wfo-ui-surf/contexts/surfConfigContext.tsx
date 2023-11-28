import React, { useState } from 'react';
import { FC, ReactNode, createContext } from 'react';

import { ImpactLevel } from '../types';

export const useSurfConfig = (initialSurfConfig: SurfConfig) => {
    const [surfConfig] = useState(initialSurfConfig);
    return {
        surfConfig,
    };
};

export type SurfConfig = {
    cimDefaultSendingLevel: ImpactLevel;
};

export const SurfConfigContext = createContext<SurfConfig>({
    cimDefaultSendingLevel: ImpactLevel.NO_IMPACT,
});

export type SuftConfigProviderProps = {
    initialOrchestratorConfig: SurfConfig;
    children: ReactNode;
};

export const SurfConfigProvider: FC<SuftConfigProviderProps> = ({
    initialOrchestratorConfig,
    children,
}) => {
    const { surfConfig } = useSurfConfig(initialOrchestratorConfig);

    return (
        <SurfConfigContext.Provider value={surfConfig}>
            {children}
        </SurfConfigContext.Provider>
    );
};
