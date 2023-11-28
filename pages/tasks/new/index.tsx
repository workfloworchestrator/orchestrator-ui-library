import React from 'react';

import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiSpacer,
} from '@elastic/eui';
import { WfoNewProcessPanel } from '@orchestrator-ui/orchestrator-ui-components';

const StartProcessPage = () => {
    return (
        <>
            <EuiPageHeader pageTitle="Create new process" />
            <EuiSpacer />
            <WfoNewProcessPanel />
            <EuiSpacer />
            <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                    <EuiButton fill>Next</EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
        </>
    );
};

export default StartProcessPage;
