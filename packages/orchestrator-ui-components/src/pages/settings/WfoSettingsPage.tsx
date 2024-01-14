import React from 'react';

import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';

import { WfoFlushSettings, WfoModifySettings, WfoStatus } from '@/components';

export const WfoSettingsPage = () => {
    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Settings" />
            <EuiHorizontalRule />
            <WfoFlushSettings />
            <EuiSpacer />
            <WfoModifySettings />
            <EuiSpacer />
            <WfoStatus />
        </>
    );
};
