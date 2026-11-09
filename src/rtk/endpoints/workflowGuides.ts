import { WORKFLOW_USER_GUIDES_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';

export interface WorkflowGuideResponse {
  content: string;
}

const workflowGuidesApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    getWorkflowGuide: build.query<WorkflowGuideResponse, { workflowName: string }>({
      query: ({ workflowName }) => ({
        url: `${WORKFLOW_USER_GUIDES_ENDPOINT}/${workflowName}`,
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
