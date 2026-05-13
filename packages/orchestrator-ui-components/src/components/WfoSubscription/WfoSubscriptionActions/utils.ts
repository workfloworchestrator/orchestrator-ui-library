import { useEffect, useState } from 'react';

import { useGetProcessDetailQuery } from '@/rtk';
import { ProcessStatus, StepStatus, SubscriptionDetailProcess } from '@/types';

export const useActiveProcess = (processes: SubscriptionDetailProcess[] | undefined) => {
  const lastProcess = processes?.[processes.length - 1];
  const isLastProcessRunning = lastProcess?.lastStatus.toLowerCase() === ProcessStatus.RUNNING;

  const [processId, setProcessId] = useState<string | null>(null);

  useEffect(() => {
    if (isLastProcessRunning) {
      setProcessId(lastProcess.processId);
    }
  }, [lastProcess, isLastProcessRunning]);

  const { data: activeProcessData } = useGetProcessDetailQuery({ processId: processId ?? '' }, { skip: !processId });

  const processDetail = activeProcessData?.processes[0];
  const lastStatus = processDetail?.lastStatus.toLowerCase() as ProcessStatus;
  const hasActiveProcess = lastStatus === ProcessStatus.RUNNING || isLastProcessRunning;
  const lastState = processDetail?.steps?.[processDetail.steps.length - 1]?.status;
  const isCompleted = lastState !== undefined && [StepStatus.COMPLETE, StepStatus.SUCCESS].includes(lastState);

  return { hasActiveProcess, isCompleted, setProcessId };
};
