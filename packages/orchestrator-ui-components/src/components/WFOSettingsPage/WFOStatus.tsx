import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiPanel,
    EuiText,
} from '@elastic/eui';
import React, { FC } from 'react';
import { WFOStatusDotIcon } from '../../icons';
import { useOrchestratorTheme } from '../../hooks';
import { EngineStatusValue } from '../../types';

export type WFOStatusProps = {
    engineStatus?: EngineStatusValue;
};

export const WFOStatus: FC<WFOStatusProps> = ({ engineStatus }) => {
    const { theme } = useOrchestratorTheme();
    const isRunning = engineStatus === 'RUNNING';

    return (
        <EuiPanel
            hasShadow={false}
            color="subdued"
            paddingSize="l"
            style={{ width: '50%' }}
        >
            <EuiFlexGroup>
                <EuiFlexItem grow={false} style={{ minWidth: 140 }}>
                    <EuiText size="s">
                        <h4>Running processes</h4>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiText size="s">
                        <p>0</p>
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <EuiFlexGroup>
                <EuiFlexItem grow={false} style={{ minWidth: 132 }}>
                    <EuiText size="s">
                        <h4>Engine status</h4>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup gutterSize="xs">
                        <EuiFlexItem>
                            <WFOStatusDotIcon
                                color={
                                    isRunning
                                        ? theme.colors.success
                                        : theme.colors.warning
                                }
                            />
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiText size="xs" style={{ marginTop: 4 }}>
                                <p>{engineStatus}</p>
                            </EuiText>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
