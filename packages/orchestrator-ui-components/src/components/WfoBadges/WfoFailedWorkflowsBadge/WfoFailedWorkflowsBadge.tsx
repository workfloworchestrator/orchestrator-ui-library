import React, { ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiToolTip } from '@elastic/eui';

import { PATH_WORKFLOWS, WfoHeaderBadge } from '@/components';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoXCircleFill } from '@/icons';
import { ProcessStatusCounts, useProcessStatusCountsQuery } from '@/rtk/endpoints/processStatusCounts';

import { getWorkflowBadgeStyles } from './styles';

type WorkflowCountsSummary = {
  failed: number;
  suspended: number;
  total: number;
};

const getWorkflowCountsSummary = (processStatusCounts?: ProcessStatusCounts): WorkflowCountsSummary => {
  const failed = processStatusCounts?.process_counts.failed || 0;
  const suspended = processStatusCounts?.process_counts.suspended || 0;

  return {
    failed,
    suspended,
    total: failed + suspended,
  };
};

const WfoWorkflowsLink = ({ children }: { children: ReactNode }) => (
  <Link
    href={PATH_WORKFLOWS}
    onClick={(e) => {
      e.currentTarget.blur();
    }}
  >
    {children}
  </Link>
);

export const WfoFailedWorkflowsBadge = () => {
  const t = useTranslations();
  const { theme } = useOrchestratorTheme();
  const { failedWorkflowBadgeStyle } = useWithOrchestratorTheme(getWorkflowBadgeStyles);
  const { data: processStatusCounts } = useProcessStatusCountsQuery();

  const workflowCountsSummary = getWorkflowCountsSummary(processStatusCounts);

  if (!workflowCountsSummary.total) {
    return null;
  }

  return (
    <EuiToolTip
      position="bottom"
      content={
        <>
          <div>Failed: {workflowCountsSummary.failed}</div>
          <div>Suspended: {workflowCountsSummary.suspended}</div>
        </>
      }
    >
      <WfoWorkflowsLink>
        <WfoHeaderBadge
          css={failedWorkflowBadgeStyle}
          color={'#00000000'}
          textColor={theme.colors.textGhost}
          iconType={() => <WfoXCircleFill color={theme.colors.danger} />}
        >
          {t('main.processStatusBadge', { count: workflowCountsSummary.total, type: 'workflow' })}
        </WfoHeaderBadge>
      </WfoWorkflowsLink>
    </EuiToolTip>
  );
};
