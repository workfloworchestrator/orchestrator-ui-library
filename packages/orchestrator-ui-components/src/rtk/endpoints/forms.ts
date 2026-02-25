import { BaseQueryTypes, orchestratorApi } from '@/rtk';

const PROCESS_ENDPOINT = 'processes';
const RESUME_ENDPOINT = 'resume';
const FORMS_ENDPOINT = 'surf/forms/'; // It is still being used by example-wfo-ui

const formsApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    startProcess: build.mutation<{ id: string }, { workflowName: string; userInputs: object[] }>({
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
    resumeProcess: build.mutation<void, { processId: string; userInputs: object[] }>({
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
    startForm: build.mutation<void, { formKey: string; userInputs: object[] }>({
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

export const { useStartProcessMutation, useResumeProcessMutation, useStartFormMutation } = formsApi;
