import { METADATA_SCHEDULES_ENDPOINT } from '@/configuration/constants';
import { orchestratorApi } from '@/rtk';
import { BaseQueryTypes } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    ScheduledTaskDefinition,
    ScheduledTasksDefinitionsResult,
} from '@/types';

export const scheduledTasks = `
    query ScheduledTasks(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
    ) {
        scheduledTasks(first: $first, after: $after, sortBy: $sortBy) {
            page {
                id
                name
                nextRunTime
                trigger
                workflowId
            }
                pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
                totalItems
                sortFields
                filterFields
            }
        }
    }
`;

export type ScheduledTasksResponse = {
    schedules: ScheduledTaskDefinition[];
} & BaseGraphQlResult;

const scheduledTasksApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getScheduledTasks: builder.query<
            ScheduledTasksResponse,
            GraphqlQueryVariables<ScheduledTaskDefinition>
        >({
            query: (variables) => ({
                document: scheduledTasks,
                variables,
            }),
            transformResponse: (
                response: ScheduledTasksDefinitionsResult,
            ): ScheduledTasksResponse => {
                const schedules = response.scheduledTasks.page || [];
                const pageInfo = response.scheduledTasks.pageInfo || {};
                return {
                    schedules,
                    pageInfo,
                };
            },
        }),
        deleteScheduledTask: builder.mutation<
            unknown,
            { workflowId: string; scheduleId: string }
        >({
            query: ({ workflowId, scheduleId }) => ({
                url: METADATA_SCHEDULES_ENDPOINT,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    scheduled_type: 'delete',
                    workflow_id: workflowId,
                    schedule_id: scheduleId,
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
    }),
});

export const {
    useGetScheduledTasksQuery,
    useLazyGetScheduledTasksQuery,
    useDeleteScheduledTaskMutation,
} = scheduledTasksApi;
