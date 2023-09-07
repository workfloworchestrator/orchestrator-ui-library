import React from 'react';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    WFOMultiListSection,
    WFONewProcessPanel,
    WFOStatCards,
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
