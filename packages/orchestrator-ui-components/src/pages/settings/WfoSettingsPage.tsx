import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiHorizontalRule, EuiSpacer } from '@elastic/eui';

import {
    WfoEngineStatus,
    WfoFlushSettings,
    WfoModifySettings,
    WfoWorkerStatus,
} from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { useOrchestratorTheme } from '@/hooks';

export const WfoSettingsPage = () => {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('main');

    return (
        <>
            <WfoContentHeader
                title={t('settings')}
                subtitle={<EuiHorizontalRule margin="s" />}
            />

            <div css={{ maxWidth: theme.base * 40 }}>
                <WfoFlushSettings />
                <EuiSpacer />
                <WfoModifySettings />
                <EuiSpacer />
                <WfoEngineStatus />
                <EuiSpacer />
                <WfoWorkerStatus />
            </div>
        </>
    );
};
