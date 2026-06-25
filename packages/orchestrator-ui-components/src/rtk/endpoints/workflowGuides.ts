import { orchestratorApi } from '@/rtk';

import { workflowGuideMocks } from './workflowGuideMocks';

export interface WorkflowGuideResponse {
  // Raw markdown content of the user guide. Empty string means no guide is available.
  content: string;
}

const workflowGuidesApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Returns the markdown user guide for a workflow/task by name.
     *
     * MOCK: currently served from bundled markdown (see workflowGuideMocks.ts).
     * When the backend endpoint exists, replace this `queryFn` with:
     *   query: ({ workflowName }) => ({
     *     url: `workflow-guides/${workflowName}`,
     *     method: 'GET',
     *   }),
     *   extraOptions: { baseQueryType: BaseQueryTypes.fetch },
     * and remove workflowGuideMocks.ts.
     */
    getWorkflowGuide: build.query<WorkflowGuideResponse, { workflowName: string }>({
      queryFn: ({ workflowName }) => {
        const content = workflowGuideMocks[workflowName] ?? '';
        return { data: { content } };
      },
    }),
  }),
});

export const { useGetWorkflowGuideQuery } = workflowGuidesApi;
