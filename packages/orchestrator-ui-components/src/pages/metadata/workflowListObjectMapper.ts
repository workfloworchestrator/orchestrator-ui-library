import { WorkflowListItem } from './WfoWorkflowsPage';
import {
    GraphQLSort,
    WorkflowDefinition,
    WorkflowDefinitionsResult,
} from '../../types';

export const mapWorkflowDefinitionToWorkflowListItem = (
    workflowDefinitionResult: WorkflowDefinitionsResult,
): WorkflowListItem[] =>
    workflowDefinitionResult.workflows.page.map((workflowDefinition) => {
        const { name, target, description, createdAt, products } =
            workflowDefinition;

        const productTags = products.map((product) => product.tag);

        return {
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
