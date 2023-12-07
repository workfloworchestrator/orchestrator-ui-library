import React, { FunctionComponent } from 'react';

import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';

import { useEngineStatusMutation, useEngineStatusQuery } from '../../hooks';
import { WfoFlushSettings } from './WfoFlushSettings';
import { WfoModifySettings } from './WfoModifySettings';
import { WfoStatus } from './WfoStatus';

export const WfoSettingsPage: FunctionComponent = () => {
    const { data: engineStatus } = useEngineStatusQuery();
    const { mutate, data: newEngineStatus } = useEngineStatusMutation();

    const isRunning =
        newEngineStatus?.global_status === 'RUNNING' ||
        engineStatus?.global_status === 'RUNNING';
    const currentEngineStatus =
        newEngineStatus?.global_status || engineStatus?.global_status;

    const changeEngineStatus = () => {
        mutate({ global_lock: isRunning });
    };

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Settings" />
            <EuiHorizontalRule />
            <WfoFlushSettings />
            <EuiSpacer />
            <WfoModifySettings
                engineStatus={currentEngineStatus}
                changeEngineStatus={changeEngineStatus}
            />
            <EuiSpacer />
            <WfoStatus engineStatus={currentEngineStatus} />
        </>
    );
};
