import { GraphQLSort, TaskDefinition } from '@/types';

import { TaskListItem } from './WfoTasksPage';

export const mapTaskDefinitionToTaskListItem = (
    tasks: TaskDefinition[],
): TaskListItem[] =>
    tasks.map((taskDefinition) => {
        const { workflowId, name, target, description, createdAt, products } =
            taskDefinition;

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

export const taskFieldMapper = (
    field: keyof TaskListItem,
): keyof TaskDefinition => {
    switch (field) {
        case 'productTags':
            return 'productTag' as keyof TaskDefinition;
        default:
            return field;
    }
};

export const graphQlTaskListMapper = ({
    field,
    order,
}: GraphQLSort<TaskListItem>) => ({
    field: taskFieldMapper(field),
    order,
});
