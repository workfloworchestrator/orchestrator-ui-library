import { EuiButton, EuiSpacer, EuiPanel, EuiText } from '@elastic/eui';
import React, { FunctionComponent } from 'react';

export const ModifySettings: FunctionComponent = () => {
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
            <EuiButton color="warning" fill iconType="pause">
                Pause the engine
            </EuiButton>
        </EuiPanel>
    );
};
