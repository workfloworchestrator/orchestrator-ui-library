import { EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';
import React, { FC } from 'react';
import { WFOEngineStatusButton } from './WFOEngineStatusButton';
import { EngineStatusValue } from '../../types';

export type WFOModifySettingsProps = {
    engineStatus?: EngineStatusValue;
    changeEngineStatus: () => void;
};

export const WFOModifySettings: FC<WFOModifySettingsProps> = ({
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
        <WFOEngineStatusButton
            engineStatus={engineStatus}
            changeEngineStatus={changeEngineStatus}
        />
    </EuiPanel>
);
