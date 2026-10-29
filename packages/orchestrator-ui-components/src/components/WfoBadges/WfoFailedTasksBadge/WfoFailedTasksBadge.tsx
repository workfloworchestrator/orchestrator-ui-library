import React, { ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiToolTip } from '@elastic/eui';

import { PATH_TASKS, WfoHeaderBadge } from '@/components';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoCheckmarkCircleFill, WfoXCircleFill } from '@/icons';
import { ProcessStatusCounts, useProcessStatusCountsQuery } from '@/rtk/endpoints/processStatusCounts';

import { getTasksBadgeStyles } from './styles';

type TaskCountsSummary = {
  failed: number;
  inconsistentData: number;
  apiUnavailable: number;
  total: number;
};

const getTaskCountsSummary = (processStatusCounts?: ProcessStatusCounts): TaskCountsSummary => {
  const failed = processStatusCounts?.task_counts.failed || 0;
  const inconsistentData = processStatusCounts?.task_counts.inconsistent_data || 0;
  const apiUnavailable = processStatusCounts?.task_counts.api_unavailable || 0;

  return {
    failed,
    inconsistentData,
    apiUnavailable,
    total: failed + inconsistentData + apiUnavailable,
  };
};

const WfoTasksLink = ({ children }: { children: ReactNode }) => (
  <Link
    href={PATH_TASKS}
    onClick={(e) => {
      e.currentTarget.blur();
    }}
  >
    {children}
  </Link>
);

export const WfoFailedTasksBadge = () => {
  const t = useTranslations();
  const { theme } = useOrchestratorTheme();
  const { failedTaskBadgeStyle } = useWithOrchestratorTheme(getTasksBadgeStyles);
  const { data: processStatusCounts } = useProcessStatusCountsQuery();

  const taskCountsSummary = getTaskCountsSummary(processStatusCounts);

  if (taskCountsSummary.total != 0) {
    return (
      <EuiToolTip
        position="bottom"
        content={
          <>
            <div>Failed: {taskCountsSummary.failed}</div>
            <div>Inconsistent data: {taskCountsSummary.inconsistentData}</div>
            <div>API unavailable: {taskCountsSummary.apiUnavailable}</div>
          </>
        }
      >
        <WfoTasksLink>
          <WfoHeaderBadge
            css={failedTaskBadgeStyle}
            color={'#00000000'}
            textColor={theme.colors.textGhost}
            iconType={() => <WfoXCircleFill color={theme.colors.danger} />}
          >
            {t('main.processStatusBadge', { count: taskCountsSummary.total, type: 'task' })}
          </WfoHeaderBadge>
        </WfoTasksLink>
      </EuiToolTip>
    );
  }

  return (
    <EuiToolTip position="bottom" content={<div>{t('common.noFailedTasks')}</div>}>
      <WfoTasksLink>
        <WfoHeaderBadge
          css={failedTaskBadgeStyle}
          color={'#ffffff00'}
          textColor={theme.colors.textGhost}
          iconType={() => <WfoCheckmarkCircleFill color={theme.colors.success} />}
        >
          {t('main.processStatusBadge', { count: 0, type: 'task' })}
        </WfoHeaderBadge>
      </WfoTasksLink>
    </EuiToolTip>
  );
};
