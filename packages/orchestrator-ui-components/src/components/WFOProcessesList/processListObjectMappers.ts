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
            customer: customer.fullname,
            customerAbbreviation: customer.shortcode,
        };
    });

// Some fields are not a key of Process, however backend still supports them
// Backend concatenates object name with the key, e.g. product.name becomes productName
const fieldMapper = (field: keyof ProcessListItem): keyof Process => {
    switch (field) {
        case 'workflowName':
        case 'lastStep':
        case 'lastStatus':
        case 'workflowTarget':
        case 'createdBy':
        case 'assignee':
        case 'processId':
        case 'startedAt':
        case 'lastModifiedAt':
        case 'subscriptions':
            return field;
        case 'customer':
            return 'customerFullname' as keyof Process;
        case 'customerAbbreviation':
            return 'customerShortcode' as keyof Process;
        case 'productName':
            return 'productName' as keyof Process;
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
