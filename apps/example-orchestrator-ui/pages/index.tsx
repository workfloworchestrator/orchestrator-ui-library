import React from 'react';
import {
    EuiBreadcrumb,
    EuiBreadcrumbs,
    EuiPageHeader,
    EuiSpacer,
} from '@elastic/eui';
import StatCards from '../components/StartPage/StatCards';
import NewProcessPanel from '../components/StartPage/NewProcessPanel';
import ListsStartPage from '../components/StartPage/ListsStartPage';

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
            <ListsStartPage />
        </>
    );
}

export default Index;
