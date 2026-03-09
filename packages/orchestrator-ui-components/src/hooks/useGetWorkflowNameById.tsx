import { NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS } from '@/configuration';
import { useGetTasksQuery } from '@/rtk';
import { ScheduledTaskDefinition } from '@/types';

export type UseGetWorkflowNameByIdReturnProps = {
  workflowName: string;
};

export const useGetWorkflowNameById = (workflowId: ScheduledTaskDefinition['workflowId']) => {
  const { data, isFetching, isError } = useGetTasksQuery({
    first: NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS,
    after: 0,
  });

  const workflowName = isFetching || isError ? '' : data?.tasks.find((task) => task.workflowId === workflowId)?.name;

  return { workflowName };
};
