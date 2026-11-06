import { useTranslations } from 'next-intl';

import { useShowToastMessage } from '@/hooks';
import { getErrorDetail, useSearchExportMutation } from '@/rtk';
import type { GraphqlSearchPayload } from '@/rtk/graphqlSearch';
import { EntityKind, PaginatedSearchResults, ResultColumToPropertyMap, ToastTypes } from '@/types';
import { getCsvFileNameWithDate, getSearchExportTruncation, initiateCsvFileDownload } from '@/utils';

// Maps the response columns of the REST search (export) to the item properties
const getItemsFromExportResponse = <T extends object>(
  data: PaginatedSearchResults,
  searchPathToProperty: ResultColumToPropertyMap<T>,
): T[] =>
  (data?.data ?? []).map(({ response_columns }) =>
    Object.fromEntries(
      Object.entries(response_columns).flatMap(([searchPath, value]) => {
        const property = searchPathToProperty.get(searchPath);
        return property ? [[property, value]] : [];
      }),
    ),
  ) as T[];

type UseSearchExportOptions<T, Column> = {
  entityKind: EntityKind;
  searchPathToProperty: ResultColumToPropertyMap<T>;
  tableColumnConfig: Partial<Record<keyof T, Column>>;
  fileName: string;
};

export const useSearchExport = <T extends object, Column extends { label?: string } = object>({
  entityKind,
  searchPathToProperty,
  tableColumnConfig,
  fileName,
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
        response_columns: Array.from(searchPathToProperty.keys()),
      }).unwrap();
      const exportItems = getItemsFromExportResponse<T>(exportResult, searchPathToProperty);
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
        [...searchPathToProperty.values()].map(getCsvColumnName),
        getCsvFileNameWithDate(fileName),
      );
    } catch (error) {
      showToastMessage(ToastTypes.ERROR, getErrorDetail(error, true)?.toString(), 'Error');
    }
  };

  return { exportData, isExporting };
};
