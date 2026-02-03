import { METADATA_SCHEDULES_ENDPOINT } from '@/configuration/constants';
import { orchestratorApi } from '@/rtk';
import { BaseQueryTypes } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    ScheduledTaskDefinition,
    ScheduledTasksDefinitionsResult,
    TaskType,
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

/* 
https://apscheduler.readthedocs.io/en/3.x/modules/triggers/interval.html#module-apscheduler.triggers.interval
Possible parameters:
weeks (int) – number of weeks to wait
days (int) – number of days to wait
hours (int) – number of hours to wait
minutes (int) – number of minutes to wait
seconds (int) – number of seconds to wait
start_date (datetime|str) – starting point for the interval calculation
end_date (datetime|str) – latest possible date/time to trigger on
timezone (datetime.tzinfo|str) – time zone to use for the date/time calculations
jitter (int|None) – delay the job execution by jitter seconds at most
*/

export type InterValKwargs = {
    weeks?: number;
    days?: number;
    hours?: number;
    start_date: string;
};

/*
https://apscheduler.readthedocs.io/en/3.x/modules/triggers/date.html#module-apscheduler.triggers.date
Possible Parameters:
run_date (datetime|str) – the date/time to run the job at
timezone (datetime.tzinfo|str) – time zone for run_date if it doesn’t have one already
*/
export type DateKwargs = {
    run_date: string;
};

/*
https://apscheduler.readthedocs.io/en/3.x/modules/triggers/cron.html#module-apscheduler.triggers.cron
Triggers when current time matches all specified time constraints, similarly to how the UNIX cron scheduler works.

Possible parameters:
year (int|str) – 4-digit year
month (int|str) – month (1-12)
day (int|str) – day of month (1-31)
week (int|str) – ISO week (1-53)
day_of_week (int|str) – number or name of weekday (0-6 or mon,tue,wed,thu,fri,sat,sun)
hour (int|str) – hour (0-23)
minute (int|str) – minute (0-59)
second (int|str) – second (0-59)
start_date (datetime|str) – earliest possible date/time to trigger on (inclusive)
end_date (datetime|str) – latest possible date/time to trigger on (inclusive)
timezone (datetime.tzinfo|str) – time zone to use for the date/time calculations (defaults to scheduler timezone)
jitter (int|None) – delay the job execution by jitter seconds at most
*/
export type CronKwargs = {
    year?: number;
    month?: number;
    day?: number;
    week?: number;
    day_of_week?: number;
    hour?: number;
    minute?: number;
    second?: number;
    start_date: string;
};

type Kwargs = DateKwargs | InterValKwargs | CronKwargs;

export type ScheduledTaskPostPayload = {
    workflowId: string;
    type: TaskType;
    kwargs: Kwargs;
};

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
        createScheduledTask: builder.mutation<
            unknown,
            ScheduledTaskPostPayload
        >({
            query: (payload) => {
                const scheduleTaskPayload = {
                    scheduled_type: 'create',
                    name: 'Test name 123',
                    workflow_name: 'Test workflow name 1234',
                    workflow_id: payload.workflowId,
                    trigger: payload.type,
                    trigger_kwargs: payload.kwargs,
                };

                return {
                    url: METADATA_SCHEDULES_ENDPOINT,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: scheduleTaskPayload,
                };
            },
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
    useCreateScheduledTaskMutation,
} = scheduledTasksApi;
