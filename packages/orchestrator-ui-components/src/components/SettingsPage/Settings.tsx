import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';
import React, { FunctionComponent } from 'react';
import { FlushSettings } from './FlushSettings';
import { ModifySettings } from './ModifySettings';
import { Status } from './Status';
import { useEngineStatusMutation, useEngineStatusQuery } from '../../hooks';

export const Settings: FunctionComponent = () => {
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
            <EuiPageHeader pageTitle="Settings" />
            <EuiHorizontalRule />
            <FlushSettings />
            <EuiSpacer />
            <ModifySettings
                engineStatus={currentEngineStatus}
                changeEngineStatus={changeEngineStatus}
            />
            <EuiSpacer />
            <Status engineStatus={currentEngineStatus} />
        </>
    );
};
