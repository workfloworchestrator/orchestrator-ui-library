import React from 'react';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    WFOMultiListSection,
    WFONewProcessPanel,
    WFOStatCards,
    WFOTimeline,
} from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    return (
        <>
            <WFOTimeline />
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
