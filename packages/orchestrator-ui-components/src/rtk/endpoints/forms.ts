import {
    BaseQueryTypes,
    orchestratorApi,
} from '@orchestrator-ui/orchestrator-ui-components';

const PROCESS_ENDPOINT = 'processes/';

const formsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        startProcess: build.mutation<
            unknown,
            { workflowName: string; userInputs: object[] }
        >({
            query: ({ workflowName, userInputs }) => ({
                url: `${PROCESS_ENDPOINT}${workflowName}`,
                method: 'POST',
                body: JSON.stringify(userInputs),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
    }),
});

export const { useStartProcessMutation } = formsApi;
