import React, { JSX, useContext } from 'react';

import { WfoLoading } from '@/components';
import { OrchestratorConfigContext } from '@/contexts';
import { PolicyContextProvider } from '@/contexts/PolicyContext';
import { useWfoSession } from '@/hooks';

interface AuthProps {
    children: JSX.Element;
    isAllowed?: (resource: string, routerPath: string) => boolean;
}

export const WfoAuth = ({
    children,
    isAllowed = () => true,
}: AuthProps): JSX.Element => {
    const { authActive } = useContext(OrchestratorConfigContext);
    const { status } = useWfoSession({
        required: authActive,
    });

    if (status === 'loading') {
        return <WfoLoading />;
    }

    return (
        <PolicyContextProvider initialIsAllowed={isAllowed}>
            {children}
        </PolicyContextProvider>
    );
};
