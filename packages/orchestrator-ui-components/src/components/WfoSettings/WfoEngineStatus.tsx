import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { WfoRenderContentOrLoading } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { WfoStatusDotIcon } from '@/icons';
import { useGetEngineStatusQuery } from '@/rtk';
import { EngineStatus } from '@/types';

export const WfoEngineStatus = () => {
  const { theme } = useOrchestratorTheme();
  const { data, isFetching } = useGetEngineStatusQuery(undefined, { refetchOnMountOrArgChange: true });
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
          <WfoRenderContentOrLoading isLoading={isFetching}>
            <EuiText size="s">{runningProcesses || '-'}</EuiText>
          </WfoRenderContentOrLoading>
        </EuiFlexItem>
        <EuiFlexItem css={{ flexDirection: 'row' }}>
          <EuiText size="s" style={{ minWidth: isFetching ? 200 : 190 }}>
            {t('status')}
          </EuiText>
          <WfoRenderContentOrLoading isLoading={isFetching}>
            <WfoStatusDotIcon color={isRunning ? theme.colors.success : theme.colors.warning} />
            <EuiText size="xs" css={{ paddingTop: theme.size.xs }}>
              {engineStatus}
            </EuiText>
          </WfoRenderContentOrLoading>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};
