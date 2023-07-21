import React from 'react';
import {
    EuiPageHeader,
    EuiSpacer,
    EuiFlexGroup,
    EuiFlexItem,
    EuiButton,
} from '@elastic/eui';
import { NewProcessPanel } from '@orchestrator-ui/orchestrator-ui-components';

export function NewProcess() {
    return (
        <>
            <EuiPageHeader pageTitle="Create new process" />
            <EuiSpacer />
            <NewProcessPanel />
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
