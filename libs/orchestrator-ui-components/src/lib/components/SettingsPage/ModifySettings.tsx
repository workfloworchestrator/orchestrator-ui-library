import { EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';
import React, { FunctionComponent } from 'react';
import {
    useEngineStatusMutation,
    useEngineStatusQuery,
} from '../../hooks/useEngineStatusQuery';
import { EngineStatusButton } from './EngineStatusButton';

export const ModifySettings: FunctionComponent = () => {
    const { data: engineStatus, isLoading } = useEngineStatusQuery();
    const { mutate } = useEngineStatusMutation();

    const isRunning = engineStatus?.global_status === 'RUNNING';

    const changeEngineStatus = () => {
        mutate({ global_lock: isRunning });
    };

    return (
        <EuiPanel
            hasShadow={false}
            color="subdued"
            paddingSize="l"
            style={{ width: '50%' }}
        >
            <EuiText size="s" style={{ fontWeight: 600 }}>
                <p>Modify the engine settings</p>
            </EuiText>
            <EuiSpacer size="s"></EuiSpacer>
            <EuiText size="s" style={{ fontWeight: 300 }}>
                <p>Stop or start workflows through this menu</p>
            </EuiText>
            <EuiSpacer size="m"></EuiSpacer>
            <EngineStatusButton
                isLoading={isLoading}
                isRunning={isRunning}
                changeEngineStatus={changeEngineStatus}
            />
        </EuiPanel>
    );
};
