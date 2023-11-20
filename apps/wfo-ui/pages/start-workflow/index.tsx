import React from 'react';

import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiSpacer,
} from '@elastic/eui';
import { WfoNewProcessPanel } from '@orchestrator-ui/orchestrator-ui-components';

export function NewProcess() {
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
}

export default NewProcess;
