import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner, EuiPanel, EuiText } from '@elastic/eui';

import { useGetWorkerStatusQuery } from '@/rtk';
import { WorkerTypes } from '@/types';

export const WfoWorkerStatus = () => {
  const { data, isFetching } = useGetWorkerStatusQuery(undefined, { refetchOnMountOrArgChange: true });

  const { executorType, numberOfQueuedJobs, numberOfRunningJobs, numberOfWorkersOnline } = data || {};

  const t = useTranslations('settings.page');

  if (executorType?.toUpperCase() !== WorkerTypes.CELERY) {
    return null;
  }

  const renderValueOrSpinner = (value: number | undefined) =>
    isFetching ? <EuiLoadingSpinner size="s" /> : <EuiText size="s">{value || '-'}</EuiText>;

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
          {renderValueOrSpinner(numberOfQueuedJobs)}
        </EuiFlexItem>
        <EuiFlexItem css={{ flexDirection: 'row' }}>
          <EuiText size="s" style={{ minWidth: 200 }}>
            {t('numberOfRunningJobs')}
          </EuiText>
          {renderValueOrSpinner(numberOfRunningJobs)}
        </EuiFlexItem>
        <EuiFlexItem css={{ flexDirection: 'row' }}>
          <EuiText size="s" style={{ minWidth: 200 }}>
            {t('numberOfWorkersOnline')}
          </EuiText>
          {renderValueOrSpinner(numberOfWorkersOnline)}
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};
