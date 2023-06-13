import React from 'react';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
// "Circular dependency between "example-orchestrator-ui" and "orchestrator-ui-components" detected: example-orchestrator-ui" How can it be solved ?
import {
    StatCards,
    NewProcessPanel,
    MultiListSection,
} from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    return (
        <>
            <EuiPageHeader pageTitle="Goodmorning Hans" />
            <EuiSpacer />
            <NewProcessPanel />
            <EuiSpacer />
            <StatCards />
            <EuiSpacer />
            <MultiListSection />
        </>
    );
}

export default Index;
