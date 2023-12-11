import React from 'react';

import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';

import { EngineStatus } from '@/types';

import { WfoFlushSettings } from './WfoFlushSettings';
import { WfoModifySettings } from './WfoModifySettings';
import { WfoStatus } from './WfoStatus';

interface WfoSettingsProps {
    currentEngineStatus: EngineStatus | undefined;
    currentRunningProcesses: number | undefined;
    changeEngineStatus: () => void;
}
export const WfoSettings = ({
    currentEngineStatus,
    currentRunningProcesses,
    changeEngineStatus,
}: WfoSettingsProps) => {
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
                runningProcesses={currentRunningProcesses}
            />
        </>
    );
};
