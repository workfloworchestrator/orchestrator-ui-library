import { GraphQLSort, WorkflowDefinition } from '@/types';

import { WorkflowListItem } from './WfoWorkflowsPage';

export const mapWorkflowDefinitionToWorkflowListItem = (
    workflows: WorkflowDefinition[],
): WorkflowListItem[] =>
    workflows.map((workflowDefinition) => {
        const { workflowId, name, target, description, createdAt, products } =
            workflowDefinition;
        const productTags = products.map((product) => product.tag);

        return {
            workflowId,
            name,
            description,
            target,
            createdAt,
            productTags,
        };
    });

export const workflowFieldMapper = (
    field: keyof WorkflowListItem,
): keyof WorkflowDefinition => {
    switch (field) {
        case 'productTags':
            return 'productTag' as keyof WorkflowDefinition;
        default:
            return field;
    }
};

export const graphQlWorkflowListMapper = ({
    field,
    order,
}: GraphQLSort<WorkflowListItem>) => ({
    field: workflowFieldMapper(field),
    order,
});
