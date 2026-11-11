import { useTranslations } from 'next-intl';

import { useShowToastMessage } from '@/hooks';
import { getErrorDetail, useSearchExportMutation } from '@/rtk';
import type { GraphqlSearchPayload } from '@/rtk/graphqlSearch';
import { EntityKind, PaginatedSearchResults, ResultColumToPropertyMap, ToastTypes } from '@/types';
import { getCsvFileNameWithDate, getSearchExportTruncation, initiateCsvFileDownload } from '@/utils';

// An export column that is built from several response columns, e.g. the items of a list that the search index
// stores at numbered paths. getValue receives the requested response columns of one result.
export type WfoExportComputedColumn<T> = {
  property: keyof T;
  responseColumns: string[];
  getValue: (responseColumns: Record<string, unknown>) => unknown;
};

// Maps the response columns of the REST search (export) to the item properties
const getItemsFromExportResponse = <T extends object>(
  data: PaginatedSearchResults,
  searchPathToProperty: ResultColumToPropertyMap<T>,
  computedColumns: WfoExportComputedColumn<T>[],
): T[] =>
  (data?.data ?? []).map(({ response_columns }) =>
    Object.fromEntries([
      ...Object.entries(response_columns).flatMap(([searchPath, value]) => {
        const property = searchPathToProperty.get(searchPath);
        return property ? [[property, value]] : [];
      }),
      ...computedColumns.map(({ property, getValue }) => [property, getValue(response_columns)]),
    ]),
  ) as T[];

type UseSearchExportOptions<T, Column> = {
  entityKind: EntityKind;
  searchPathToProperty: ResultColumToPropertyMap<T>;
  tableColumnConfig: Partial<Record<keyof T, Column>>;
  fileName: string;
  // Columns that are computed per result from additional response columns, written after the other columns
  computedColumns?: WfoExportComputedColumn<T>[];
};

export const useSearchExport = <T extends object, Column extends { label?: string } = object>({
  entityKind,
  searchPathToProperty,
  tableColumnConfig,
  fileName,
  computedColumns = [],
}: UseSearchExportOptions<T, Column>) => {
  const getCsvColumnName = (key: keyof T) => tableColumnConfig[key]?.label ?? (key as string);

  const tError = useTranslations('errors');
  const { showToastMessage } = useShowToastMessage();
  const [searchExportTrigger, { isLoading: isExporting }] = useSearchExportMutation();

  const exportData = async (searchPayload: GraphqlSearchPayload) => {
    try {
      const exportResult = await searchExportTrigger({
        ...searchPayload,
        entity_type: entityKind,
        response_columns: [
          ...searchPathToProperty.keys(),
          ...computedColumns.flatMap(({ responseColumns }) => responseColumns),
        ],
      }).unwrap();
      const exportItems = getItemsFromExportResponse<T>(exportResult, searchPathToProperty, computedColumns);
      if (!exportItems.length) {
        return;
      }
      const truncation = getSearchExportTruncation(exportResult, exportItems.length);
      if (truncation) {
        showToastMessage(
          ToastTypes.ERROR,
          tError('notAllResultsExported', truncation),
          tError('notAllResultsExportedTitle'),
        );
      }
      const csvItems = exportItems.map((item) =>
        Object.fromEntries(Object.entries(item).map(([key, value]) => [getCsvColumnName(key as keyof T), value])),
      );
      initiateCsvFileDownload(
        csvItems,
        [...searchPathToProperty.values(), ...computedColumns.map(({ property }) => property)].map(getCsvColumnName),
        getCsvFileNameWithDate(fileName),
      );
    } catch (error) {
      showToastMessage(ToastTypes.ERROR, getErrorDetail(error, true)?.toString(), 'Error');
    }
  };

  return { exportData, isExporting };
};
