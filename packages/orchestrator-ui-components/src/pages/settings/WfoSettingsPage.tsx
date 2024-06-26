import React from 'react';

import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';

import { WfoFlushSettings, WfoModifySettings, WfoStatus } from '@/components';
import { useOrchestratorTheme } from '@/hooks';

export const WfoSettingsPage = () => {
    const { theme } = useOrchestratorTheme();

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Settings" />
            <EuiHorizontalRule />
            <div css={{ maxWidth: theme.base * 40 }}>
                <WfoFlushSettings />
                <EuiSpacer />
                <WfoModifySettings />
                <EuiSpacer />
                <WfoStatus />
            </div>
        </>
    );
};
