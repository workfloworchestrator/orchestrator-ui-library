import React from 'react';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    WfoMultiListSection,
    WfoNewProcessPanel,
    WfoStatCards,
} from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    return (
        <>
            <EuiPageHeader pageTitle="Goodmorning Hans" />
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
