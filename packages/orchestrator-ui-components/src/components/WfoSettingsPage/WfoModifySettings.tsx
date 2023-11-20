import React, { FC } from 'react';

import { EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';

import { EngineStatusValue } from '../../types';
import { WfoEngineStatusButton } from './WfoEngineStatusButton';

export type WfoModifySettingsProps = {
    engineStatus?: EngineStatusValue;
    changeEngineStatus: () => void;
};

export const WfoModifySettings: FC<WfoModifySettingsProps> = ({
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
        <WfoEngineStatusButton
            engineStatus={engineStatus}
            changeEngineStatus={changeEngineStatus}
        />
    </EuiPanel>
);
