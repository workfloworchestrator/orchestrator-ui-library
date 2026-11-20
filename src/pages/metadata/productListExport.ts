import { useTranslations } from 'next-intl';

import type { WfoDataSorting } from '@/components/WfoTable/utils/columns';
import { useShowToastMessage } from '@/hooks';
import { ProductsResponse, useLazyGetProductsQuery } from '@/rtk';
import { GraphQLSort, GraphqlQueryVariables, ProductDefinition } from '@/types';
import { getConcatenatedResult, getQueryVariablesForExport } from '@/utils';
import { csvDownloadHandler, getCsvFileNameWithDate } from '@/utils/csvDownload';

import type { ProductListItem } from './WfoProductsPage';

// The search index has no paths for the nested lists, so the search export leaves these columns out
const NOT_EXPORTED_PROPERTIES: (keyof ProductListItem)[] = ['fixedInputs', 'productBlocks'];

type ProductDefinitionExportItem = Omit<ProductDefinition, 'fixedInputs' | 'productBlocks'> & {
  fixedInputs: string;
  productBlocks: string;
};

// The export uses the old products query instead of the search export, which has no response columns for the
// nested fixedInputs and productBlocks lists. It exports all columns, hidden or not.
export const getProductExportQueryVariables = (
  dataSorting: WfoDataSorting<ProductListItem>,
  pageSize: number,
  query: string,
): GraphqlQueryVariables<ProductDefinition> => ({
  first: pageSize,
  after: 0,
  sortBy:
    dataSorting.sortOrder ?
      // score is no field of the products query, so it sorts on the name like the default sort does
      ({
        field: dataSorting.field === 'score' ? 'name' : dataSorting.field,
        order: dataSorting.sortOrder,
      } as GraphQLSort<ProductDefinition>)
    : undefined,
  query: query || undefined,
});

export const mapProductDefinitionsToExportItems = ({ products }: ProductsResponse): ProductDefinitionExportItem[] =>
  products.map(({ productId, name, tag, description, productType, status, fixedInputs, productBlocks, createdAt }) => ({
    productId,
    name,
    tag,
    description,
    productType,
    status,
    fixedInputs: getConcatenatedResult(fixedInputs, ['name', 'value']),
    productBlocks: getConcatenatedResult(productBlocks, ['name']),
    createdAt,
  }));

// The key order and the column labels come from the table, so the csv follows the table configuration
export const getProductExportColumnKeys = (tableColumns: object): string[] =>
  Object.keys(tableColumns).filter((column) => !NOT_EXPORTED_PROPERTIES.includes(column as keyof ProductListItem));

export const useProductListExport = <Column extends { label?: string }>(
  tableColumns: Partial<Record<keyof ProductListItem, Column>>,
  dataSorting: WfoDataSorting<ProductListItem>,
  pageSize: number,
  query: string,
) => {
  const tError = useTranslations('errors');
  const { showToastMessage } = useShowToastMessage();
  const [getProductsTrigger, { isFetching: isExporting }] = useLazyGetProductsQuery();

  const getProductsForExport = () =>
    getProductsTrigger(
      getQueryVariablesForExport(getProductExportQueryVariables(dataSorting, pageSize, query)),
    ).unwrap();

  const exportData = csvDownloadHandler(
    getProductsForExport,
    mapProductDefinitionsToExportItems,
    (data) => data?.pageInfo ?? {},
    getProductExportColumnKeys(tableColumns),
    getCsvFileNameWithDate('Products'),
    showToastMessage,
    tError,
  );

  return { exportData, isExporting };
};
