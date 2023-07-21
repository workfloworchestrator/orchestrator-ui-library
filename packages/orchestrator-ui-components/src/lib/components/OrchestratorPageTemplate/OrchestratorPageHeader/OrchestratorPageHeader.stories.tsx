import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import type { Meta } from '@storybook/react';
import React, { ReactElement } from 'react';
import { OrchestratorPageHeader } from './OrchestratorPageHeader';
import Logo from '../../../../../.storybook/mockdata/logo-orchestrator.svg';

const Story: Meta<typeof OrchestratorPageHeader> = {
    component: OrchestratorPageHeader,
    title: 'PageTemplate/OrchestratorPageHeader',
};
export default Story;

function getAppLogo(navigationLogo: number): ReactElement {
    return (
        <EuiFlexGroup alignItems="center" css={{ height: navigationLogo }}>
            <EuiFlexItem>
                <img
                    src={Logo}
                    alt="Orchestrator Logo"
                    width={134}
                    height={32}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
}

export const Default = {
    args: {
        getAppLogo,
        navigationHeight: 50,
    },
    parameters: {
        mockData: [
            {
                url: 'https://testing.test/settings/status',
                method: 'GET',
                status: 200,
                response: {
                    global_lock: false,
                    running_processes: 1,
                    global_status: 'RUNNING',
                },
            },
            {
                url: 'https://testing.test/processes/status-counts',
                method: 'GET',
                status: 200,
                response: {
                    process_counts: {
                        failed: 6,
                        completed: 249,
                        aborted: 2,
                        resumed: 3,
                    },
                    task_counts: {
                        aborted: 1,
                        failed: 3,
                        completed: 3,
                    },
                },
            },
        ],
    },
};
