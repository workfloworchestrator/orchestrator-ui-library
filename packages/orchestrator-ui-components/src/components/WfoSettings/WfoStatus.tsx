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
import { useGetEngineStatusQuery } from '@/rtk';
import { EngineStatus } from '@/types';

export const WfoStatus = () => {
    const { theme } = useOrchestratorTheme();
    const { data } = useGetEngineStatusQuery();
    const { engineStatus, runningProcesses } = data || {};
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
                        <p>{runningProcesses || '-'}</p>
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
