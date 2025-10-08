import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoStatusDotIcon } from '@/icons';
import { useGetEngineStatusQuery } from '@/rtk';
import { EngineStatus } from '@/types';

export const WfoEngineStatus = () => {
    const { theme } = useOrchestratorTheme();
    const { data } = useGetEngineStatusQuery();
    const { engineStatus, runningProcesses } = data || {};
    const isRunning = engineStatus === EngineStatus.RUNNING;
    const t = useTranslations('settings.page');

    return (
        <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
            <EuiFlexGroup direction="column" gutterSize="s">
                <EuiFlexItem>
                    <EuiText size="s">
                        <h4>{t('engineStatusTitle')}</h4>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem css={{ flexDirection: 'row' }}>
                    <EuiText size="s" style={{ minWidth: 200 }}>
                        {t('runningProcesses')}
                    </EuiText>
                    <EuiText size="s">{runningProcesses || '-'}</EuiText>
                </EuiFlexItem>
                <EuiFlexItem css={{ flexDirection: 'row' }}>
                    <EuiText size="s" style={{ minWidth: 190 }}>
                        {t('status')}
                    </EuiText>
                    <WfoStatusDotIcon
                        color={
                            isRunning
                                ? theme.colors.success
                                : theme.colors.warning
                        }
                    />
                    <EuiText size="xs" css={{ paddingTop: theme.size.xs }}>
                        <p>{engineStatus}</p>
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
