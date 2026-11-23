import { useTranslations } from 'next-intl';

import type { WfoDataSorting } from '@/components/WfoTable/utils/columns';
import { useShowToastMessage } from '@/hooks';
import { ProductBlocksResponse, useLazyGetProductBlocksQuery } from '@/rtk';
import { GraphQLSort, GraphqlQueryVariables, ProductBlockDefinition } from '@/types';
import { getConcatenatedResult, getQueryVariablesForExport } from '@/utils';
import { csvDownloadHandler, getCsvFileNameWithDate } from '@/utils/csvDownload';

import type { ProductBlockListItem } from './WfoProductBlocksPage';

type ProductBlockExportItem = Omit<ProductBlockDefinition, 'resourceTypes' | 'dependsOn'> & {
  resourceTypes: string;
  dependsOn: string;
};

// The search index has no paths for the nested lists, so the search export would leave these columns out. The
// export therefore uses the old product blocks query, which returns them. It exports all columns, hidden or not.
export const getProductBlockExportQueryVariables = (
  dataSorting: WfoDataSorting<ProductBlockListItem>,
  pageSize: number,
  query: string,
): GraphqlQueryVariables<ProductBlockDefinition> => ({
  first: pageSize,
  after: 0,
  sortBy:
    dataSorting.sortOrder ?
      // score is no field of the product blocks query, so it sorts on the name like the default sort does
      ({
        field: dataSorting.field === 'score' ? 'name' : dataSorting.field,
        order: dataSorting.sortOrder,
      } as GraphQLSort<ProductBlockDefinition>)
    : undefined,
  query: query || undefined,
});

export const mapProductBlockDefinitionsToExportItems = ({
  productBlocks,
}: ProductBlocksResponse): ProductBlockExportItem[] =>
  productBlocks.map(
    ({ productBlockId, name, tag, description, status, resourceTypes, dependsOn, createdAt, endDate }) => ({
      productBlockId,
      name,
      tag,
      description,
      status,
      resourceTypes: getConcatenatedResult(resourceTypes, ['resourceType', 'description']),
      dependsOn: getConcatenatedResult(dependsOn, ['name']),
      createdAt,
      endDate,
    }),
  );

// The key order and the column labels come from the table, so the csv follows the table configuration
export const getProductBlockExportColumnKeys = (tableColumns: object): string[] =>
  Object.keys(tableColumns).filter((column) => column !== 'score');

export const useProductBlockListExport = <Column extends { label?: string }>(
  tableColumns: Partial<Record<keyof ProductBlockListItem, Column>>,
  dataSorting: WfoDataSorting<ProductBlockListItem>,
  pageSize: number,
  query: string,
) => {
  const tError = useTranslations('errors');
  const { showToastMessage } = useShowToastMessage();
  const [getProductBlocksTrigger, { isFetching: isExporting }] = useLazyGetProductBlocksQuery();

  const getProductBlocksForExport = () =>
    getProductBlocksTrigger(
      getQueryVariablesForExport(getProductBlockExportQueryVariables(dataSorting, pageSize, query)),
    ).unwrap();

  const exportData = csvDownloadHandler(
    getProductBlocksForExport,
    mapProductBlockDefinitionsToExportItems,
    (data) => data?.pageInfo ?? {},
    getProductBlockExportColumnKeys(tableColumns),
    getCsvFileNameWithDate('ProductBlocks'),
    showToastMessage,
    tError,
  );

  return { exportData, isExporting };
};
