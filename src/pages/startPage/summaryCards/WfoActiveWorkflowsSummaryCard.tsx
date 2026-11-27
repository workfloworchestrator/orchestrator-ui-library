import React from 'react';

import { useTranslations } from 'next-intl';

import { PATH_WORKFLOWS, WfoSummaryCard } from '@/components';
import { useGetProcessListSummaryQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

import { mapProcessSummaryToSummaryCardListItem } from '../mappers';
import { activeWorkflowsListSummaryQueryVariables } from '../queryVariables';

export const WfoActiveWorkflowsSummaryCard = () => {
  const t = useTranslations('startPage.activeWorkflows');

  const {
    data: activeWorkflowsSummaryResponse,
    isFetching,
    isLoading,
  } = useGetProcessListSummaryQuery(activeWorkflowsListSummaryQueryVariables);

  return (
    <WfoSummaryCard
      headerTitle={t('headerTitle')}
      headerValue={activeWorkflowsSummaryResponse?.pageInfo.totalItems ?? '-'}

      listTitle={t('listTitle')}
      listItems={optionalArrayMapper(activeWorkflowsSummaryResponse?.processes, mapProcessSummaryToSummaryCardListItem)}
      button={{ name: t('buttonText'), url: PATH_WORKFLOWS }}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};
