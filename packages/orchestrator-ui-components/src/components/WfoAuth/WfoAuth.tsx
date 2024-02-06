import React, { JSX, useContext } from 'react';

import { loadPolicy } from '@open-policy-agent/opa-wasm';

import { WfoLoading } from '@/components';
import { OrchestratorConfigContext } from '@/contexts';
import { useWfoSession } from '@/hooks';

interface AuthProps {
    children: JSX.Element;
}

export const WfoAuth = ({ children }: AuthProps): JSX.Element => {
    const { authActive } = useContext(OrchestratorConfigContext);
    const { status, session } = useWfoSession({
        required: authActive,
    });

    // TODO: Can only do this when logged in with OIDC
    const getPolicy = async () => {
        const policyResult = await fetch('https://[public-bundle]/[clientId]');
        const policyWasm = await policyResult.arrayBuffer();
        return await loadPolicy(policyWasm);
    };

    getPolicy().then((loadedPolicy) => {
        if (session) {
            const { profile } = session;

            const policyInput = {
                resource: '/orchestrator/prefixes/',
                active: true,
                // client_id: 'orchestrator-client.test.automation.surf.net', // TEST
                client_id: 'orchestrator-client.automation.surf.net', // Production
                method: 'GET',
                ...profile,
            };
            const policyTestResult = loadedPolicy.evaluate(policyInput);
            console.error('Policy test', {
                policyResult: policyTestResult[0].result,
                policyTestResult,
                policyInput,
                profile,
            });
        }
    });

    if (status === 'loading') {
        return <WfoLoading />;
    }
    return children;
};
