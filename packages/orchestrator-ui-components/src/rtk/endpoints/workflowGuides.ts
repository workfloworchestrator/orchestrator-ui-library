import { BaseQueryTypes, orchestratorApi } from '@/rtk';

export interface WorkflowGuideResponse {
  // Raw markdown content of the user guide. Empty string means no guide is available.
  content: string;
}

const workflowGuidesApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    getWorkflowGuide: build.query<WorkflowGuideResponse, { workflowName: string }>({
      query: ({ workflowName }) => ({
        url: `surf/workflow_user_guides/${workflowName}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (content: string): WorkflowGuideResponse => ({ content: content ?? '' }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
  }),
});

export const { useGetWorkflowGuideQuery } = workflowGuidesApi;
