import { TranslationValues } from 'next-intl';

import { MAXIMUM_ITEMS_FOR_BULK_FETCHING } from '@/configuration';
import { GraphQLPageInfo, PaginatedSearchResults, ToastTypes } from '@/types';

import { toObjectWithSerializedValues } from './toObjectWithSerializedValues';
import { toObjectWithSortedKeys } from './toObjectWithSortedKeys';

function toCsvFileContent<T extends object>(data: T[]): string {
  const headers = Object.keys(data[0]).join(';');
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => (value === null ? '' : `"${value}"`))
      .join(';')
      .split('\n')
      .join(' '),
  );
  return [headers, ...rows].join('\n');
}

function startCsvDownload(csvFileContent: string, fileName: string) {
  const blob = new Blob([csvFileContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function totalItemsExceedMaximumItemsForBulkFetching(totalItems?: number | null) {
  return (totalItems ?? 0) > MAXIMUM_ITEMS_FOR_BULK_FETCHING;
}

// This function should be used when the data is mapped and ready to be exported
export function initiateCsvFileDownload<T extends object>(data: T[], keyOrder: string[], fileName: string) {
  const dataForExport = data.map((dataRow) => toObjectWithSortedKeys(toObjectWithSerializedValues(dataRow), keyOrder));

  const csvFileContent = toCsvFileContent(dataForExport);
  startCsvDownload(csvFileContent, fileName);
}

export const getCsvFileNameWithDate = (fileNameWithoutExtension: string) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${fileNameWithoutExtension}_${year}-${month}-${day}-${hour}${minute}${second}.csv`;
};

// The search export endpoint caps the rows at SEARCH_MAX_EXPORT_LIMIT and only signals the cut-off through
// has_next_page. Returns the values for the notAllResultsExported toast, or undefined when nothing was cut off.
export const getSearchExportTruncation = (exportResult: PaginatedSearchResults, exportedCount: number) =>
  exportResult.page_info.has_next_page ?
    { totalResults: exportResult.cursor?.total_items ?? exportedCount, maximumExportedResults: exportedCount }
  : undefined;

// This async function should be used when the exported data needs to be fetched from somewhere else
export const csvDownloadHandler =
  <T extends object, U extends object>(
    dataFetchFunction: () => Promise<T | undefined>,
    dataMapper: (data: T) => U[],
    pageInfoMapper: (data: T) => GraphQLPageInfo,
    keyOrder: string[],
    filename: string,
    addToastFunction: (type: ToastTypes, text: string, title: string) => void,
    translationFunction: (translationKey: string, variables?: TranslationValues) => string,
  ) =>
  async () => {
    const fetchResult: T | undefined = await dataFetchFunction();

    if (!fetchResult) {
      return;
    }

    const data = dataMapper(fetchResult);
    const pageInfo = pageInfoMapper(fetchResult);

    if (totalItemsExceedMaximumItemsForBulkFetching(pageInfo.totalItems)) {
      addToastFunction(
        ToastTypes.ERROR,
        translationFunction('notAllResultsExported', {
          totalResults: pageInfo.totalItems,
          maximumExportedResults: MAXIMUM_ITEMS_FOR_BULK_FETCHING,
        }),
        translationFunction('notAllResultsExportedTitle'),
      );
    }

    initiateCsvFileDownload(data, keyOrder, filename);
  };

export const getPageInfoForSyncExport = (
  dataLength: number,
  sortFields?: string[],
  filterFields?: string[],
): GraphQLPageInfo => ({
  startCursor: 0,
  endCursor: Math.max(0, dataLength - 1),
  hasNextPage: false,
  totalItems: dataLength,
  hasPreviousPage: false,
  sortFields: sortFields ?? [],
  filterFields: filterFields ?? [],
});
