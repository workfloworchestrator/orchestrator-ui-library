import React from 'react';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
// "Circular dependency between "example-orchestrator-ui" and "orchestrator-ui-components" detected: example-orchestrator-ui" How can it be solved ?
import {
    WFOStatCards,
    WFONewProcessPanel,
    WFOMultiListSection,
} from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    return (
        <>
            <EuiPageHeader pageTitle="Goodmorning Hans" />
            <EuiSpacer />
            <WFONewProcessPanel />
            <EuiSpacer />
            <WFOStatCards />
            <EuiSpacer />
            <WFOMultiListSection />
        </>
    );
}

export default Index;
