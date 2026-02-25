import { ProcessListResponse } from '@/rtk';
import { GraphQLSort, GraphqlFilter, Process, Subscription } from '@/types';
import { getConcatenatedPagedResult } from '@/utils';

import { ProcessListExportItem, ProcessListItem } from './WfoProcessesList';

export const mapGraphQlProcessListResultToPageInfo = (processesResponse: ProcessListResponse) =>
  processesResponse.pageInfo;

export const mapGraphQlProcessListResultToProcessListItems = (processes: Process[]): ProcessListItem[] =>
  processes.map((process) => {
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
      isTask,
    } = process;

    return {
      workflowName,
      lastStep,
      lastStatus,
      workflowTarget,
      createdBy,
      assignee,
      processId,
      isTask,
      startedAt: new Date(startedAt),
      lastModifiedAt: new Date(lastModifiedAt),
      subscriptions,
      productName: product?.name,
      tag: product?.tag,
      customer: customer.fullname,
      customerAbbreviation: customer.shortcode,
    };
  });

export const mapGraphQlProcessListExportResultToProcessListItems = (
  processesResponse: ProcessListResponse,
): ProcessListExportItem[] =>
  processesResponse.processes.map((process) => {
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
      isTask,
    } = process;

    return {
      workflowName,
      lastStep,
      lastStatus,
      workflowTarget,
      createdBy,
      assignee,
      processId,
      isTask,
      startedAt: new Date(startedAt),
      lastModifiedAt: new Date(lastModifiedAt),
      subscriptions: getConcatenatedPagedResult<Pick<Subscription, 'subscriptionId' | 'description'>>(subscriptions, [
        'subscriptionId',
        'description',
      ]),
      productName: product?.name,
      productTag: product?.tag,
      customer: customer.fullname,
      customerAbbreviation: customer.shortcode,
    };
  });

// Some fields are not a key of Process, however backend still supports them
// Backend concatenates object name with the key, e.g. product.name becomes productName
// Todo: typecast is needed until ticket is implemented:
// https://github.com/workfloworchestrator/orchestrator-ui/issues/290
const fieldMapper = (field: keyof ProcessListItem): keyof Process => {
  switch (field) {
    case 'customer':
      return 'customerFullname' as keyof Process;
    case 'customerAbbreviation':
      return 'customerShortcode' as keyof Process;
    case 'productName':
      return 'productName' as keyof Process;
    case 'tag':
      return 'tag' as keyof Process;
    default:
      return field;
  }
};

export const graphQlProcessSortMapper = ({ field, order }: GraphQLSort<ProcessListItem>): GraphQLSort<Process> => ({
  field: fieldMapper(field),
  order,
});

export const graphQlProcessFilterMapper = (
  data?: GraphqlFilter<ProcessListItem>[],
): GraphqlFilter<Process>[] | undefined =>
  data?.map(({ field, value }) => ({
    field: fieldMapper(field),
    value,
  }));
