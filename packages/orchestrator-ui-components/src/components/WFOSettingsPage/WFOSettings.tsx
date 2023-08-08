import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';
import React, { FunctionComponent } from 'react';
import { WFOFlushSettings } from './WFOFlushSettings';
import { WFOModifySettings } from './WFOModifySettings';
import { WFOStatus } from './WFOStatus';
import { useEngineStatusMutation, useEngineStatusQuery } from '../../hooks';

export const WFOSettings: FunctionComponent = () => {
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
            <WFOFlushSettings />
            <EuiSpacer />
            <WFOModifySettings
                engineStatus={currentEngineStatus}
                changeEngineStatus={changeEngineStatus}
            />
            <EuiSpacer />
            <WFOStatus engineStatus={currentEngineStatus} />
        </>
    );
};
