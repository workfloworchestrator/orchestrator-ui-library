import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    WfoMultiListSection,
    WfoNewProcessPanel,
    WfoStatCards,
} from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    const t = useTranslations('main');
    return (
        <>
            <EuiPageHeader pageTitle={`${t('welcome')} Georgi`} />

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
