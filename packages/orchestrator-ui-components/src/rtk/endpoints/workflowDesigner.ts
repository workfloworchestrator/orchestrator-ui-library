import { WORKFLOW_DESIGNER_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
  CacheTagType,
  WorkflowDesignerDefinition,
  WorkflowDesignerFieldType,
  WorkflowDesignerInfo,
  WorkflowDesignerStep,
  WorkflowDesignerStoredWorkflow,
  WorkflowDesignerValidationResult,
} from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

const jsonHeaders = { 'Content-Type': 'application/json' };
const fetchOptions = { baseQueryType: BaseQueryTypes.fetch };

// Designed workflows show up in queries of other features: the task start combobox and the step timeline.
const designedWorkflowsTag = getCacheTag(CacheTagType.designedWorkflows);

const workflowDesignerApi = orchestratorApi
  .enhanceEndpoints({
    endpoints: {
      getTaskOptions: { providesTags: designedWorkflowsTag },
      getTimeLineItems: { providesTags: designedWorkflowsTag },
    },
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getWorkflowDesignerInfo: build.query<WorkflowDesignerInfo, void>({
        query: () => ({ url: `${WORKFLOW_DESIGNER_ENDPOINT}/info` }),
        extraOptions: fetchOptions,
      }),
      getWorkflowDesignerSteps: build.query<WorkflowDesignerStep[], void>({
        query: () => ({ url: `${WORKFLOW_DESIGNER_ENDPOINT}/steps` }),
        extraOptions: fetchOptions,
      }),
      getWorkflowDesignerFieldTypes: build.query<WorkflowDesignerFieldType[], void>({
        query: () => ({ url: `${WORKFLOW_DESIGNER_ENDPOINT}/field-types` }),
        extraOptions: fetchOptions,
      }),
      validateDesignedWorkflow: build.mutation<
        WorkflowDesignerValidationResult,
        { definition: WorkflowDesignerDefinition; insertAt?: number }
      >({
        query: ({ definition, insertAt }) => ({
          url: `${WORKFLOW_DESIGNER_ENDPOINT}/validate`,
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({ definition, insert_at: insertAt ?? null }),
        }),
        extraOptions: fetchOptions,
      }),
      getDesignedWorkflows: build.query<WorkflowDesignerStoredWorkflow[], void>({
        query: () => ({ url: `${WORKFLOW_DESIGNER_ENDPOINT}/workflows` }),
        extraOptions: fetchOptions,
        providesTags: designedWorkflowsTag,
      }),
      getDesignedWorkflow: build.query<WorkflowDesignerStoredWorkflow, string>({
        query: (name) => ({ url: `${WORKFLOW_DESIGNER_ENDPOINT}/workflows/${name}` }),
        extraOptions: fetchOptions,
        providesTags: designedWorkflowsTag,
      }),
      createDesignedWorkflow: build.mutation<WorkflowDesignerStoredWorkflow, WorkflowDesignerDefinition>({
        query: (definition) => ({
          url: `${WORKFLOW_DESIGNER_ENDPOINT}/workflows`,
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify(definition),
        }),
        extraOptions: fetchOptions,
        invalidatesTags: designedWorkflowsTag,
      }),
      updateDesignedWorkflow: build.mutation<WorkflowDesignerStoredWorkflow, WorkflowDesignerDefinition>({
        query: (definition) => ({
          url: `${WORKFLOW_DESIGNER_ENDPOINT}/workflows/${definition.name}`,
          method: 'PUT',
          headers: jsonHeaders,
          body: JSON.stringify(definition),
        }),
        extraOptions: fetchOptions,
        invalidatesTags: designedWorkflowsTag,
      }),
      deleteDesignedWorkflow: build.mutation<{ result: 'deleted' | 'archived' }, string>({
        query: (name) => ({
          url: `${WORKFLOW_DESIGNER_ENDPOINT}/workflows/${name}`,
          method: 'DELETE',
        }),
        extraOptions: fetchOptions,
        invalidatesTags: designedWorkflowsTag,
      }),
    }),
  });

export const {
  useGetWorkflowDesignerInfoQuery,
  useGetWorkflowDesignerStepsQuery,
  useGetWorkflowDesignerFieldTypesQuery,
  useValidateDesignedWorkflowMutation,
  useGetDesignedWorkflowsQuery,
  useGetDesignedWorkflowQuery,
  useCreateDesignedWorkflowMutation,
  useUpdateDesignedWorkflowMutation,
  useDeleteDesignedWorkflowMutation,
} = workflowDesignerApi;
