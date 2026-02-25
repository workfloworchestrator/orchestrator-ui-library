import React from 'react';

import { WfoError } from '@/components/WfoError';
import { WfoLoading } from '@/components/WfoLoading';
import { useGetSchedulesForWorkflow } from '@/hooks';
import { ScheduledTaskDefinition } from '@/types';

import { WfoScheduledTasksBadges } from './WfoScheduledTasksBadges';

export const WfoScheduledTasksBadgesContainer = ({
  workflowId,
}: {
  workflowId: ScheduledTaskDefinition['workflowId'];
}) => {
  const { workflowSchedules, isFetching, isError } = useGetSchedulesForWorkflow(workflowId);

  if (isFetching) {
    return <WfoLoading />;
  }

  if (isError) {
    return <WfoError />;
  }

  return <WfoScheduledTasksBadges workflowSchedules={workflowSchedules} />;
};
