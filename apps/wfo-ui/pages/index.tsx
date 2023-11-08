import React from 'react';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    WfoMultiListSection,
    WfoNewProcessPanel,
    WfoStatCards,
} from '@orchestrator-ui/orchestrator-ui-components';
import { useSession } from 'next-auth/react';

export function Index() {
    const { data: session } = useSession();
    const username = session?.user?.name || '';
    return (
        <>
            <EuiPageHeader pageTitle={`Goodmorning ${username}`} />
            <EuiSpacer />
            <WfoNewProcessPanel />
            <EuiSpacer />
            <WfoStatCards />
            <EuiSpacer />
            <WfoMultiListSection />
        </>
    );
}

export default Index;
