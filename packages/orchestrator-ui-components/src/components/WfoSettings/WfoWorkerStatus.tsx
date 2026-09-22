import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { WfoRenderContentOrLoading } from '@/components';
import { useGetWorkerStatusQuery } from '@/rtk';
import { WorkerTypes } from '@/types';

export const WfoWorkerStatus = () => {
  const { data, isFetching } = useGetWorkerStatusQuery(undefined, { refetchOnMountOrArgChange: true });

  const { executorType, numberOfQueuedJobs, numberOfRunningJobs, numberOfWorkersOnline } = data || {};

  const t = useTranslations('settings.page');

  if (data && executorType?.toUpperCase() !== WorkerTypes.CELERY) {
    return null;
  }

  return (
    <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
      <EuiFlexGroup direction="column" gutterSize="s">
        <EuiFlexItem>
          <EuiText size="s">
            <h4>{t('workerStatusTitle')}</h4>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem css={{ flexDirection: 'row' }}>
          <EuiText size="s" style={{ minWidth: 200 }}>
            {t('numberOfQueuedJobs')}
          </EuiText>
          <WfoRenderContentOrLoading isLoading={isFetching}>
            <EuiText size="s">{numberOfQueuedJobs || '-'}</EuiText>
          </WfoRenderContentOrLoading>
        </EuiFlexItem>
        <EuiFlexItem css={{ flexDirection: 'row' }}>
          <EuiText size="s" style={{ minWidth: 200 }}>
            {t('numberOfRunningJobs')}
          </EuiText>
          <WfoRenderContentOrLoading isLoading={isFetching}>
            <EuiText size="s">{numberOfRunningJobs || '-'}</EuiText>
          </WfoRenderContentOrLoading>
        </EuiFlexItem>
        <EuiFlexItem css={{ flexDirection: 'row' }}>
          <EuiText size="s" style={{ minWidth: 200 }}>
            {t('numberOfWorkersOnline')}
          </EuiText>
          <WfoRenderContentOrLoading isLoading={isFetching}>
            <EuiText size="s">{numberOfWorkersOnline || '-'}</EuiText>
          </WfoRenderContentOrLoading>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};
