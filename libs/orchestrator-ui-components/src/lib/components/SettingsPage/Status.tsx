import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiPanel,
    EuiText,
} from '@elastic/eui';
import React, { FunctionComponent } from 'react';
import { StatusDotIcon } from '../../icons';
import { useEngineStatusQuery, useOrchestratorTheme } from '../../hooks';

export const Status: FunctionComponent = () => {
    const { theme } = useOrchestratorTheme();
    const { data: engineStatus } = useEngineStatusQuery();
    const engineStatusText: string = engineStatus?.global_status
        ? `${engineStatus.global_status}`
        : 'unavailable';
    const isRunning = engineStatus?.global_status === 'RUNNING';

    return (
        <EuiPanel
            hasShadow={false}
            color="subdued"
            paddingSize="l"
            style={{ width: '50%' }}
        >
            <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                    <EuiText size="s" style={{ fontWeight: 600 }}>
                        <p>Running processes</p>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiText size="s" style={{ fontWeight: 300 }}>
                        <p>0</p>
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                    <EuiText size="s" style={{ fontWeight: 600, padding: 0 }}>
                        <p>Engine status</p>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup gutterSize="xs">
                        <EuiFlexItem>
                            <StatusDotIcon
                                color={
                                    isRunning
                                        ? theme.colors.success
                                        : theme.colors.warning
                                }
                            />
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiText
                                size="s"
                                style={{ fontWeight: 300, padding: 0 }}
                            >
                                <p>{engineStatusText}</p>
                            </EuiText>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
