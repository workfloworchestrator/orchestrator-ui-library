import { EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';
import React, { FC } from 'react';
import { EngineStatusButton } from './EngineStatusButton';
import { EngineStatusValue } from '../../types';

export type ModifySettingsProps = {
    engineStatus?: EngineStatusValue;
    changeEngineStatus: () => void;
};

export const ModifySettings: FC<ModifySettingsProps> = ({
    engineStatus,
    changeEngineStatus,
}) => (
    <EuiPanel
        hasShadow={false}
        color="subdued"
        paddingSize="l"
        css={{ width: '50%' }}
    >
        <EuiText size={'s'}>
            <h4>Modify the engine settings</h4>
            <p>Stop or start workflows through this menu</p>
        </EuiText>
        <EuiSpacer size="m"></EuiSpacer>
        <EngineStatusButton
            engineStatus={engineStatus}
            changeEngineStatus={changeEngineStatus}
        />
    </EuiPanel>
);
