import React from 'react';

import { useTranslations } from 'next-intl';

import { PATH_TASKS, SummaryCardStatus, WfoSummaryCard } from '@/components';
import { mapProcessSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { taskListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetProcessListSummaryQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

export const WfoFailedTasksSummaryCard = () => {
  const t = useTranslations('startPage.failedTasks');

  const {
    data: failedTasksSummaryResponse,
    isFetching,
    isLoading,
  } = useGetProcessListSummaryQuery(taskListSummaryQueryVariables);

  return (
    <WfoSummaryCard
      headerTitle={t('headerTitle')}
      headerValue={failedTasksSummaryResponse?.pageInfo.totalItems ?? '-'}
      headerStatus={SummaryCardStatus.Error}
      listTitle={t('listTitle')}
      listItems={optionalArrayMapper(failedTasksSummaryResponse?.processes, mapProcessSummaryToSummaryCardListItem)}
      button={{ name: t('buttonText'), url: PATH_TASKS }}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};
