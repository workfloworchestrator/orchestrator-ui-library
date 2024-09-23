import {
    ProductDefinition,
    StartOptionsResult,
    WorkflowDefinition,
    WorkflowTarget,
} from '@/types';

import { orchestratorApi } from '../api';

const workflowOptionsQuery = `
    query StartOptions {
        workflows(first: 1000000, after: 0, filterBy: [{ field: "target", value: "${WorkflowTarget.CREATE}"}]) {
            page {
                name
                products {
                    productType
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

type WorkflowOption = {
    workflowName: WorkflowDefinition['name'];
    productName: ProductDefinition['name'];
    productId: ProductDefinition['productId'];
    productType: ProductDefinition['productType'];
};

type WorkflowOptionsResult = StartOptionsResult<{
    name: WorkflowDefinition['name'];
    products: {
        name: ProductDefinition['name'];
        productId: ProductDefinition['productId'];
        productType: ProductDefinition['productType'];
    }[];
}>;

export type StartOptionsResponse<StartOption> = {
    startOptions: StartOption[];
};

type TaskOption = Pick<WorkflowDefinition, 'name' | 'description'>;
type TaskOptionsResult = StartOptionsResult<TaskOption>;

const startButtonOptionsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getWorkflowOptions: build.query<
            StartOptionsResponse<WorkflowOption>,
            void
        >({
            query: () => ({
                document: workflowOptionsQuery,
            }),
            transformResponse: (response: WorkflowOptionsResult) => {
                const startOptions: WorkflowOption[] = [];
                const workflows = response.workflows?.page || [];
                workflows.forEach((workflow) => {
                    const workflowName = workflow.name;
                    workflow.products.forEach((product) => {
                        startOptions.push({
                            workflowName,
                            productName: product.name,
                            productId: product.productId,
                            productType: product.productType,
                        });
                    });
                });

                return { startOptions };
            },
        }),
        getTaskOptions: build.query<StartOptionsResponse<TaskOption>, void>({
            query: () => ({
                document: taskOptionsQuery,
            }),
            transformResponse: (response: TaskOptionsResult) => {
                return {
                    startOptions: response.workflows.page.map((option) => ({
                        name: option.name,
                        description: option.description,
                    })),
                };
            },
        }),
    }),
});

export const { useGetWorkflowOptionsQuery, useGetTaskOptionsQuery } =
    startButtonOptionsApi;
