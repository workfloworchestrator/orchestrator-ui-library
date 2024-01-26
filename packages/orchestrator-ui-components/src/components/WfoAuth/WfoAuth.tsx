import React, { JSX, useContext } from 'react';

import { useSession } from 'next-auth/react';

import { WfoLoading } from '@/components';
import { OrchestratorConfigContext } from '@/contexts';

interface AuthProps {
    children: JSX.Element;
}

export const WfoAuth = ({ children }: AuthProps): JSX.Element => {
    const { authActive } = useContext(OrchestratorConfigContext);
    const { status, data } = useSession({
        required: authActive,
    });

    // want to handle the OPA here
    console.log('WfoAuth', { authActive, status, data });

    if (status === 'loading') {
        return <WfoLoading />;
    }
    return children;
};
