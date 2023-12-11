import React from 'react';

import { WfoSettings } from '@/components';
import { useEngineStatusMutation, useEngineStatusQuery } from '@/hooks';
import { EngineStatus } from '@/types';

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
        <WfoSettings
            currentEngineStatus={currentEngineStatus}
            currentRunningProcesses={currentRunningProcesses}
            changeEngineStatus={changeEngineStatus}
        />
    );
};
