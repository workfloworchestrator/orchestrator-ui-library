import { NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS } from '@/configuration';
import { useGetScheduledTasksQuery } from '@/rtk';
import { ScheduledTaskDefinition } from '@/types';

export type UseGetSchedulesForWorkflowReturnProps = {
  workflowSchedules: ScheduledTaskDefinition['trigger'][];
  isFetching: boolean;
  isError: boolean;
};

export const useGetSchedulesForWorkflow = (workflowId: ScheduledTaskDefinition['workflowId']) => {
  const { data, isFetching, isError } = useGetScheduledTasksQuery({
    first: NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS,
    after: 0,
  });

  const workflowSchedules =
    isFetching ?
      []
    : data?.schedules
        .filter((scheduledTaskDefinition) => {
          return scheduledTaskDefinition.workflowId === workflowId;
        })
        .map((scheduledTaskDefinition) => {
          return scheduledTaskDefinition.trigger;
        });

  return { workflowSchedules, isFetching, isError };
};
