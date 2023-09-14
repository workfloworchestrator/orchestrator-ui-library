import {
    GraphqlFilter,
    GraphQLSort,
    Process,
    ProcessesResult,
} from '../../types';
import { ProcessListItem } from './WFOProcessList';

export const mapGraphQlProcessListResultToProcessListItems = (
    processesResult: ProcessesResult,
): ProcessListItem[] =>
    processesResult.processes.page.map((process) => {
        const {
            workflowName,
            lastStep,
            lastStatus,
            workflowTarget,
            createdBy,
            assignee,
            processId,
            startedAt,
            lastModifiedAt,
            subscriptions,
            product,
            customer,
        } = process;

        return {
            workflowName,
            lastStep,
            lastStatus,
            workflowTarget,
            createdBy,
            assignee,
            processId,
            startedAt,
            lastModifiedAt,
            subscriptions,
            productName: product?.name,
            productTag: product?.tag,
            customer: customer.fullname,
            customerAbbreviation: customer.shortcode,
        };
    });

// Some fields are not a key of Process, however backend still supports them
// Backend concatenates object name with the key, e.g. product.name becomes productName
const fieldMapper = (field: keyof ProcessListItem): keyof Process => {
    switch (field) {
        case 'customer':
            return 'customerFullname' as keyof Process;
        case 'customerAbbreviation':
            return 'customerShortcode' as keyof Process;
        case 'productName':
            return 'productName' as keyof Process;
        case 'productTag':
            return 'productTag' as keyof Process;
        default:
            return field;
    }
};

export const graphQLSortMapper = ({
    field,
    order,
}: GraphQLSort<ProcessListItem>): GraphQLSort<Process> => ({
    field: fieldMapper(field),
    order,
});

export const graphQLFilterMapper = (
    data?: GraphqlFilter<ProcessListItem>[],
): GraphqlFilter<Process>[] | undefined =>
    data?.map(({ field, value }) => ({
        field: fieldMapper(field),
        value,
    }));
