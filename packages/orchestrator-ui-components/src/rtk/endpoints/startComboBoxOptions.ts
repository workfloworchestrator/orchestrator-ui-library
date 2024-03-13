import {
    ProductDefinition,
    StartButtonOptionsResult,
    StartComboBoxOption,
    WorkflowDefinition,
    WorkflowTarget,
} from '@/types';

import { orchestratorApi } from '../api';

const workflowOptionsQuery = `
    query StartOptions {
        workflows(first: 1000000, after: 0, filterBy: [{ field: "target", value: "${WorkflowTarget.CREATE}"}]) {
            page {
                name
                description
                products {
                    productId
                    name
                }
            }
        }
    }
`;

const taskOptionsQuery = `
    query StartOptions {
        workflows(first: 1000000, after: 0, filterBy: [{ field: "target", value: "${WorkflowTarget.SYSTEM}"}]) {
            page {
                name
                description
            }
        }
    }
`;

export type StartButtonOptionsResponse = {
    startComboBoxOptions: StartComboBoxOption[];
};

type WorkflowOptionsResult = StartButtonOptionsResult<{
    name: WorkflowDefinition['name'];
    description: WorkflowDefinition['description'];
    products: Pick<ProductDefinition, 'productId' | 'name'>[];
}>;

type TaskOptionsResult = StartButtonOptionsResult<
    Pick<WorkflowDefinition, 'name' | 'description'>
>;

const startButtonOptionsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getWorkflowOptions: build.query<StartButtonOptionsResponse, void>({
            query: () => ({
                document: workflowOptionsQuery,
            }),
            transformResponse: (response: WorkflowOptionsResult) => {
                return {
                    startComboBoxOptions: response.workflows.page
                        .flatMap(({ name: workflowName, products }) =>
                            products.map(
                                ({ productId, name: productName }) => ({
                                    label: productName,
                                    data: {
                                        workflowName,
                                        productId,
                                    },
                                }),
                            ),
                        )
                        .sort((a, b) => a.label.localeCompare(b.label)),
                };
            },
        }),
        getTaskOptions: build.query<StartButtonOptionsResponse, void>({
            query: () => ({
                document: taskOptionsQuery,
            }),
            transformResponse: (response: TaskOptionsResult) => {
                return {
                    startComboBoxOptions: response.workflows.page.map(
                        ({ name: workflowName, description }) => ({
                            label: description ?? '',
                            data: {
                                workflowName,
                            },
                        }),
                    ),
                };
            },
        }),
    }),
});

export const { useGetWorkflowOptionsQuery, useGetTaskOptionsQuery } =
    startButtonOptionsApi;
