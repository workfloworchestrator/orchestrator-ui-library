import React from 'react';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { WfoStartPage } from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    const { data: session } = useSession();
    const t = useTranslations('main');
    const username = session?.user?.name || '';

    return (
        <>
            <EuiPageHeader pageTitle={`${t('welcome')} ${username}`} />
            <EuiSpacer />
            <WfoStartPage />
        </>
    );
}

export default Index;
