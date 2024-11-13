'use client';

import { useEffect, useState } from 'react';

import { getConfigAction } from '@/actions/getConfigAction';
import { OrchestratorConfig } from '@/contexts/ConfigContext';

export const ComponentUsingServerAction = () => {
    const [config, setConfig] = useState<OrchestratorConfig>();

    useEffect(() => {
        async function fetchConfig() {
            const configuration = await getConfigAction();
            setConfig(configuration);
        }
        fetchConfig();
    }, []);

    console.log('ComponentUsingServerAction', config);

    return <div>ComponentUsingServerAction</div>;
};
