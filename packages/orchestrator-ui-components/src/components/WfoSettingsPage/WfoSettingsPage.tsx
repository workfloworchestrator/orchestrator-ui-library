import React from 'react';

import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';

import { useEngineStatusMutation, useEngineStatusQuery } from '@/hooks';
import { EngineStatus } from '@/types';

import { WfoFlushSettings } from './WfoFlushSettings';
import { WfoModifySettings } from './WfoModifySettings';
import { WfoStatus } from './WfoStatus';

export const WfoSettingsPage = () => {
    const { data: engineStatus } = useEngineStatusQuery();
    const { mutate, data: newEngineStatus } = useEngineStatusMutation();

    const isRunning =
        newEngineStatus?.global_status === EngineStatus.RUNNING ||
        engineStatus?.global_status === EngineStatus.RUNNING;
    const currentEngineStatus =
        newEngineStatus?.global_status || engineStatus?.global_status;
    const currentRunningProcesses =
        newEngineStatus?.running_processes || engineStatus?.running_processes;

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
            <WfoStatus
                engineStatus={currentEngineStatus || EngineStatus.PAUSED}
                runningProcesses={currentRunningProcesses || 0}
            />
        </>
    );
};
