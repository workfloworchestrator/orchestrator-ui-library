import {
    GraphQLSort,
    TaskDefinition,
    TaskDefinitionsResult,
} from '../../types';
import { TaskListItem } from './WfoTasksPage';

export const mapTaskDefinitionToTaskListItem = (
    processDefinitionResult: TaskDefinitionsResult,
): TaskListItem[] =>
    processDefinitionResult.tasks.page.map((taskDefinition) => {
        const { name, target, description, createdAt, products } =
            taskDefinition;

        const productTags = products.map((product) => product.tag);

        return {
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
