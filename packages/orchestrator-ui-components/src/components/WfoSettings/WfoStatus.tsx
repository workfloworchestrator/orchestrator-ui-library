import React from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoStatusDotIcon } from '@/icons';
import { EngineStatus } from '@/types';

interface WfoStatusProps {
    engineStatus: EngineStatus;
    runningProcesses: number;
}

export const WfoStatus = ({
    engineStatus,
    runningProcesses,
}: WfoStatusProps) => {
    const { theme } = useOrchestratorTheme();
    const isRunning = engineStatus === EngineStatus.RUNNING;
    const t = useTranslations('settings.page');

    return (
        <EuiPanel
            hasShadow={false}
            color="subdued"
            paddingSize="l"
            style={{ width: '50%' }}
        >
            <EuiFlexGroup>
                <EuiFlexItem grow={false} style={{ minWidth: 208 }}>
                    <EuiText size="s">
                        <h4>{t('runningProcesses')}</h4>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiText size="s">
                        <p>{runningProcesses || 0}</p>
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <EuiFlexGroup>
                <EuiFlexItem grow={false} style={{ minWidth: 200 }}>
                    <EuiText size="s">
                        <h4>{t('engineStatus')}</h4>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup gutterSize="xs">
                        <EuiFlexItem>
                            <WfoStatusDotIcon
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
