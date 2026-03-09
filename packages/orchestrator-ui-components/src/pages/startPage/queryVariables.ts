import { MAXIMUM_ITEMS_FOR_BULK_FETCHING } from '@/configuration';
import {
  GraphqlFilter,
  GraphqlQueryVariables,
  Process,
  ProductsSummary,
  SortOrder,
  Subscription,
  SubscriptionStatus,
} from '@/types';

const baseQueryVariables: Partial<GraphqlQueryVariables<unknown>> = {
  first: 5,
  after: 0,
};
const baseQueryVariablesForSubscription: Partial<GraphqlQueryVariables<Subscription>> = {
  ...baseQueryVariables,
  sortBy: {
    field: 'startDate',
    order: SortOrder.DESC,
  },
};

const baseQueryVariablesForProcess: Partial<GraphqlQueryVariables<Process>> = {
  ...baseQueryVariables,
  sortBy: {
    field: 'startedAt',
    order: SortOrder.DESC,
  },
};

const getTaskFilter = (isTask: boolean): GraphqlFilter<Process> => {
  return {
    // Todo: isTask is not a key of Process
    // However, backend still supports it. Field should not be a keyof ProcessListItem (or process)
    // https://github.com/workfloworchestrator/orchestrator-ui/issues/290
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore waiting for fix in backend
    field: 'isTask',
    value: isTask ? 'true' : 'false',
  };
};

export const subscriptionsListSummaryQueryVariables: GraphqlQueryVariables<Subscription> = {
  ...baseQueryVariablesForSubscription,
  filterBy: [
    {
      field: 'status',
      value: 'Active',
    },
  ],
};

export const outOfSyncSubscriptionsListSummaryQueryVariables: GraphqlQueryVariables<Subscription> = {
  ...baseQueryVariablesForSubscription,
  query: 'insync:false',
  filterBy: [
    {
      field: 'status',
      value: 'Active-Provisioning',
    },
  ],
};

export const getMyWorkflowListSummaryQueryVariables = (username: string): GraphqlQueryVariables<Process> => ({
  ...baseQueryVariablesForProcess,
  filterBy: [
    getTaskFilter(false),
    {
      field: 'createdBy',
      value: username,
    },
  ],
});

export const activeWorkflowsListSummaryQueryVariables: GraphqlQueryVariables<Process> = {
  ...baseQueryVariablesForProcess,
  filterBy: [
    getTaskFilter(false),
    {
      field: 'lastStatus',
      value: 'created-running-suspended-waiting-failed-resumed-inconsistent_data-api_unavailable-awaiting_callback',
    },
  ],
};

export const taskListSummaryQueryVariables: GraphqlQueryVariables<Process> = {
  ...baseQueryVariablesForProcess,
  filterBy: [
    getTaskFilter(true),
    {
      field: 'lastStatus',
      value: 'failed-inconsistent_data-api_unavailable',
    },
  ],
};

export const productsSummaryQueryVariables: GraphqlQueryVariables<ProductsSummary & Subscription> = {
  first: MAXIMUM_ITEMS_FOR_BULK_FETCHING,
  after: 0,
  sortBy: {
    field: 'name',
    order: SortOrder.ASC,
  },
  filterBy: [
    {
      field: 'status',
      value: `!${SubscriptionStatus.TERMINATED}`,
    },
  ],
};
