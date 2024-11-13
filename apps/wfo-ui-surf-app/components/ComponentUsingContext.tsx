'use client';

import { useContext } from 'react';

import { OrchestratorConfigContext } from '@/contexts/ConfigContext';

export const ComponentUsingContext = () => {
    const configuration = useContext(OrchestratorConfigContext);

    console.log('ComponentUsingContext', configuration);

    return <div>ComponentUsingContext</div>;
};
