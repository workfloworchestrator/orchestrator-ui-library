import { useTranslations } from 'next-intl';

import type { WfoDataSorting } from '@/components/WfoTable/utils/columns';
import { useShowToastMessage } from '@/hooks';
import { ResourceTypesResponse, useLazyGetResourceTypesQuery } from '@/rtk';
import { GraphQLSort, GraphqlQueryVariables, ResourceTypeDefinition } from '@/types';
import { getConcatenatedResult, getQueryVariablesForExport } from '@/utils';
import { csvDownloadHandler, getCsvFileNameWithDate } from '@/utils/csvDownload';

import type { ResourceTypeListItem } from './WfoResourceTypesPage';

type ResourceTypeExportItem = Omit<ResourceTypeDefinition, 'productBlocks'> & {
  productBlocks: string;
};

// The export uses the old resource types query instead of the search export, which has no response columns for the
// nested productBlocks list. It exports all columns, hidden or not.
export const getResourceTypeExportQueryVariables = (
  dataSorting: WfoDataSorting<ResourceTypeListItem>,
  pageSize: number,
  query: string,
): GraphqlQueryVariables<ResourceTypeDefinition> => ({
  first: pageSize,
  after: 0,
  sortBy:
    dataSorting.sortOrder ?
      // score is no field of the resource types query, so it sorts on the resource type like the default sort does
      ({
        field: dataSorting.field === 'score' ? 'resourceType' : dataSorting.field,
        order: dataSorting.sortOrder,
      } as GraphQLSort<ResourceTypeDefinition>)
    : undefined,
  query: query || undefined,
});

export const mapResourceTypesToExportItems = ({ resourceTypes }: ResourceTypesResponse): ResourceTypeExportItem[] =>
  resourceTypes.map(({ resourceTypeId, resourceType, description, productBlocks }) => ({
    resourceTypeId,
    resourceType,
    description,
    productBlocks: getConcatenatedResult(productBlocks, ['productBlockId', 'name']),
  }));

// The key order and the column labels come from the table, so the csv follows the table configuration
export const getResourceTypeExportColumnKeys = (tableColumns: object): string[] =>
  Object.keys(tableColumns).filter((column) => column !== 'score');

export const useResourceTypeListExport = <Column extends { label?: string }>(
  tableColumns: Partial<Record<keyof ResourceTypeListItem, Column>>,
  dataSorting: WfoDataSorting<ResourceTypeListItem>,
  pageSize: number,
  query: string,
) => {
  const tError = useTranslations('errors');
  const { showToastMessage } = useShowToastMessage();
  const [getResourceTypesTrigger, { isFetching: isExporting }] = useLazyGetResourceTypesQuery();

  const getResourceTypesForExport = () =>
    getResourceTypesTrigger(
      getQueryVariablesForExport(getResourceTypeExportQueryVariables(dataSorting, pageSize, query)),
    ).unwrap();

  const exportData = csvDownloadHandler(
    getResourceTypesForExport,
    mapResourceTypesToExportItems,
    (data) => data?.pageInfo ?? {},
    getResourceTypeExportColumnKeys(tableColumns),
    getCsvFileNameWithDate('ResourceTypes'),
    showToastMessage,
    tError,
  );

  return { exportData, isExporting };
};
