import { METADATA_WORKFLOWS_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
  GraphqlSearchEdge,
  GraphqlSearchPayload,
  GraphqlSearchResponse,
  getCursorPaginationCacheOptions,
  getSearchVariables,
  toSelection,
} from '@/rtk/graphqlSearch';
import { CacheTagType, MetadataDescriptionParams, WorkflowDefinition, WorkflowDefinitionsResult } from '@/types';

export const workflowsDescription = `
query MetadataWorkflowsDescription(
    $workflowName: String!
) {
    workflows(
        filterBy: [{ field: "name", value: $workflowName }]
    ) {
        page {
            name
            description
        }
    }
}
`;

// Selected next to the requested columns: workflowId identifies the row, and products is not a search path
// (it is only requested when its column is visible)
const getWorkflowNodeSelection = (fields: string[], includeProducts: boolean) =>
  ['workflowId', ...(includeProducts ? ['products { tag }'] : []), ...fields.map(toSelection)].join('\n');

export const getWorkflowListSearchQuery = (fields: string[], includeProducts: boolean) => `
query MetadataWorkflowListSearch(
    $first: Int!
    $after: Int!
    $search: ResourceSearchInput
) {
    workflows(
        first: $first
        after: $after
        search: $search
    ) {
        searchEdges {
            score
            matchingFields {
                text
                path
                highlightIndices
            }
            node {
                ${getWorkflowNodeSelection(fields, includeProducts)}
            }
        }
        pageInfo {
            totalItems
            hasNextPage
        }
        nextPageCursor
    }
}
`;

export type WorkflowsDescriptionQueryVariables = {
  workflowName: string;
};

export type WorkflowsDescriptionResponse = Pick<WorkflowDefinition, 'name' | 'description'>;

// Only the selected columns are present in a hit
export type WorkflowSearchNode = Pick<WorkflowDefinition, 'workflowId'>
  & Partial<Omit<WorkflowDefinition, 'workflowId' | 'products'>> & {
    products?: Pick<WorkflowDefinition['products'][number], 'tag'>[];
  };

export type WorkflowSearchEdge = GraphqlSearchEdge<WorkflowSearchNode>;

export type WorkflowListSearchResponse = GraphqlSearchResponse<WorkflowSearchNode>;

export type WorkflowListSearchPayload = GraphqlSearchPayload & { includeProducts: boolean };

const workflowsApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkflowListSearch: builder.query<WorkflowListSearchResponse, WorkflowListSearchPayload>({
      query: (payload) => ({
        document: getWorkflowListSearchQuery(payload.columns, payload.includeProducts),
        variables: getSearchVariables(payload),
      }),
      transformResponse: ({ workflows }: { workflows: WorkflowListSearchResponse }) => workflows,
      ...getCursorPaginationCacheOptions<WorkflowSearchNode>(({ workflowId }) => workflowId),
      providesTags: [CacheTagType.scheduledTasks],
    }),
    getDescriptionForWorkflowName: builder.query<WorkflowsDescriptionResponse, WorkflowsDescriptionQueryVariables>({
      query: (variables) => ({
        document: workflowsDescription,
        variables,
      }),
      transformResponse: (
        response: WorkflowDefinitionsResult<Pick<WorkflowDefinition, 'name' | 'description'>>,
        _,
        variables,
      ): WorkflowsDescriptionResponse => {
        const workflows = response.workflows.page || [];
        const workflow = workflows.find(({ name }) => name === variables.workflowName);

        if (!workflow) {
          throw new Error(`No workflow found with name ${variables.workflowName}`);
        }

        const { name, description } = workflow;
        return {
          name,
          description,
        };
      },
    }),
  }),
});

export const { useGetWorkflowListSearchQuery, useGetDescriptionForWorkflowNameQuery } = workflowsApi;

const workflowsRestApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    updateWorkflow: build.mutation<null, MetadataDescriptionParams>({
      query: (workflow) => ({
        url: `${METADATA_WORKFLOWS_ENDPOINT}/${workflow.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          description: workflow.description,
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
  }),
});

export const { useUpdateWorkflowMutation } = workflowsRestApi;
