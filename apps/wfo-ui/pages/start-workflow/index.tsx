import React from 'react';
import {
    EuiPageHeader,
    EuiSpacer,
    EuiFlexGroup,
    EuiFlexItem,
    EuiButton,
} from '@elastic/eui';
import { WFONewProcessPanel } from '@orchestrator-ui/orchestrator-ui-components';

export function NewProcess() {
    return (
        <>
            <EuiPageHeader pageTitle="Create new process" />
            <EuiSpacer />
            <WFONewProcessPanel />
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
