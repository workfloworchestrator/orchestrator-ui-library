import {
    ProductDefinition,
    ProductLifecycleStatus,
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
                isAllowed
                products {
                    productType
                    productId
                    name
                    tag
                    status
                }
            }
        }
    }
`;

const taskOptionsQuery = `
    query StartOptions {
        workflows(first: 1000000, after: 0, filterBy: [{ field: "isTask", value: "true"}]) {
            page {
                name
                isAllowed
                description
            }
        }
    }
`;

type WorkflowOption = {
    workflowName: WorkflowDefinition['name'];
    isAllowed: WorkflowDefinition['isAllowed'];
    productName: ProductDefinition['name'];
    productId: ProductDefinition['productId'];
    productType: ProductDefinition['productType'];
    productTag: ProductDefinition['tag'];
};

type WorkflowOptionsResult = StartOptionsResult<{
    name: WorkflowDefinition['name'];
    isAllowed: WorkflowDefinition['isAllowed'];
    products: {
        name: ProductDefinition['name'];
        productId: ProductDefinition['productId'];
        productType: ProductDefinition['productType'];
        tag: ProductDefinition['tag'];
        status: ProductDefinition['status'];
    }[];
}>;

export type StartOptionsResponse<StartOption> = {
    startOptions: StartOption[];
};

type TaskOption = Pick<
    WorkflowDefinition,
    'name' | 'isAllowed' | 'description'
>;
type TaskOptionsResult = StartOptionsResult<TaskOption>;

const startButtonOptionsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getWorkflowOptions: build.query<
            StartOptionsResponse<WorkflowOption>,
            ProductLifecycleStatus | string
        >({
            query: () => ({
                document: workflowOptionsQuery,
            }),
            transformResponse: (
                response: WorkflowOptionsResult | undefined,
                _,
                productStatus,
            ) => {
                const statusToMatch = (
                    productStatus ?? ProductLifecycleStatus.ACTIVE
                ).toLowerCase();
                const startOptions: WorkflowOption[] = [];
                const workflows = response?.workflows?.page || [];
                workflows.forEach((workflow) => {
                    const workflowName = workflow.name;
                    workflow.products
                        .filter(
                            (product) =>
                                product.status.toLowerCase() === statusToMatch,
                        )
                        .forEach((product) => {
                            startOptions.push({
                                workflowName,
                                isAllowed: workflow.isAllowed,
                                productName: product.name,
                                productId: product.productId,
                                productType: product.productType,
                                productTag: product.tag,
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
                        isAllowed: option.isAllowed,
                        description: option.description,
                    })),
                };
            },
        }),
    }),
});

export const { useGetWorkflowOptionsQuery, useGetTaskOptionsQuery } =
    startButtonOptionsApi;
