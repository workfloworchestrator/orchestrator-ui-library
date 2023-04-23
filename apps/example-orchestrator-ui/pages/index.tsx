import React from 'react';
import {
    EuiBreadcrumb,
    EuiBreadcrumbs,
    EuiPageHeader,
    EuiSpacer,
} from '@elastic/eui';
// "Circular dependency between "example-orchestrator-ui" and "orchestrator-ui-components" detected: example-orchestrator-ui" How can it be solved ?
import {
    StatCards,
    NewProcessPanel,
    MultiListSection,
} from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    // Move this to app.tsx  ?
    const breadcrumbs: EuiBreadcrumb[] = [
        {
            text: 'Start',
            href: '#',
            onClick: (e) => {
                e.preventDefault();
            },
        },
        {
            text: '',
        },
    ];

    return (
        <>
            <EuiBreadcrumbs
                breadcrumbs={breadcrumbs}
                truncate={false}
                aria-label="Current page"
            />
            <EuiSpacer />
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
