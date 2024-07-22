import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { useGetWorkerStatusQuery } from '@/rtk';
import { WorkerTypes } from '@/types';

export const WfoWorkerStatus = () => {
    const { data } = useGetWorkerStatusQuery();

    const {
        executorType,
        numberOfQueuedJobs,
        numberOfRunningJobs,
        numberOfWorkersOnline,
    } = data || {};

    const t = useTranslations('settings.page');

    return (
        (executorType?.toUpperCase() === WorkerTypes.CELERY && (
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
                        <EuiText size="s">{numberOfQueuedJobs || '-'}</EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem css={{ flexDirection: 'row' }}>
                        <EuiText size="s" style={{ minWidth: 200 }}>
                            {t('numberOfRunningJobs')}
                        </EuiText>
                        <EuiText size="s">{numberOfRunningJobs || '-'}</EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem css={{ flexDirection: 'row' }}>
                        <EuiText size="s" style={{ minWidth: 200 }}>
                            {t('numberOfWorkersOnline')}
                        </EuiText>
                        <EuiText size="s">
                            {numberOfWorkersOnline || '-'}
                        </EuiText>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiPanel>
        )) ||
        null
    );
};
