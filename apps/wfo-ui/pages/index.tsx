import React from 'react';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { WfoStartPage } from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    const { data: session } = useSession();
    const t = useTranslations('main');
    // Sample usage of getting the user data from the session
    const username = session?.user?.name || '';

    console.log('Index', { session });

    return (
        <>
            <EuiPageHeader pageTitle={`${t('welcome')} ${username}`} />
            <EuiSpacer />
            <WfoStartPage />
        </>
    );
}

export default Index;
