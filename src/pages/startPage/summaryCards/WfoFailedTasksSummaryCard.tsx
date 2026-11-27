import React from 'react';

import { useTranslations } from 'next-intl';

import { PATH_TASKS, WfoSummaryCard } from '@/components';
import { useGetProcessListSummaryQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

import { getCountColor } from '../getCountColor';
import { mapProcessSummaryToSummaryCardListItem } from '../mappers';
import { taskListSummaryQueryVariables } from '../queryVariables';

export const WfoFailedTasksSummaryCard = () => {
  const t = useTranslations('startPage.failedTasks');

  const {
    data: failedTasksSummaryResponse,
    isFetching,
    isLoading,
  } = useGetProcessListSummaryQuery(taskListSummaryQueryVariables);
  const failedTaskCount = failedTasksSummaryResponse?.pageInfo.totalItems ?? '-';

  return (
    <WfoSummaryCard
      headerTitle={t('headerTitle')}
      headerValue={failedTaskCount}
      color={getCountColor(failedTaskCount)}
      listTitle={t('listTitle')}
      listItems={optionalArrayMapper(failedTasksSummaryResponse?.processes, mapProcessSummaryToSummaryCardListItem)}
      button={{ name: t('buttonText'), url: PATH_TASKS }}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};
