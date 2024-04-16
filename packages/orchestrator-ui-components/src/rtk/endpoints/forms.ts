import { BaseQueryTypes, orchestratorApi } from '@/rtk';

const PROCESS_ENDPOINT = 'processes';
const RESUME_ENDPOINT = 'resume';
const FORMS_ENDPOINT = 'surf/forms/'; // It is still being used by example-wfo-uo

const formsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        startProcess: build.mutation<
            unknown,
            { workflowName: string; userInputs: object[] }
        >({
            query: ({ workflowName, userInputs }) => ({
                url: `${PROCESS_ENDPOINT}/${workflowName}`,
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
        resumeProcess: build.mutation<
            unknown,
            { processId: string; userInputs: object[] }
        >({
            query: ({ processId, userInputs }) => ({
                url: `${PROCESS_ENDPOINT}/${processId}/${RESUME_ENDPOINT}`,
                method: 'PUT',
                body: JSON.stringify(userInputs),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        startForm: build.mutation<
            unknown,
            { formKey: string; userInputs: object[] }
        >({
            query: ({ formKey, userInputs }) => ({
                url: `${FORMS_ENDPOINT}${formKey}`,
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

export const {
    useStartProcessMutation,
    useResumeProcessMutation,
    useStartFormMutation,
} = formsApi;
