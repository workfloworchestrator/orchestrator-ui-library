import { TranslationValues } from 'next-intl';

import { MAXIMUM_ITEMS_FOR_BULK_FETCHING } from '@/configuration/constants';
import { ToastTypes } from '@/types';
import { GraphQLPageInfo } from '@/types';
import { sortObjectKeys } from '@/utils/sortObjectKeys';

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

export function initiateCsvFileDownload<T extends object>(
    data: T[],
    fileName: string,
) {
    const csvFileContent = toCsvFileContent(data);
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

export const csvDownloadHandler = <T extends object, U extends object>(
    dataFetchFunction: () => Promise<T | undefined>,
    dataMapper: (data: T) => U[],
    pageInfoMapper: (data: T) => GraphQLPageInfo,
    keyOrder: string[],
    filename: string,
    addToastFunction: (type: ToastTypes, text: string, title: string) => void,
    translationFunction: (
        translationKey: string,
        variables?: TranslationValues,
    ) => string,
) => {
    return async () => {
        const data: T | undefined = await dataFetchFunction();

        if (data) {
            const dataForExport = dataMapper(data).map((d) =>
                sortObjectKeys(d, keyOrder),
            );
            const pageInfo = pageInfoMapper(data);
            (pageInfo.totalItems ?? 0) > MAXIMUM_ITEMS_FOR_BULK_FETCHING &&
                addToastFunction(
                    ToastTypes.ERROR,
                    translationFunction('notAllResultsExported', {
                        totalResults: pageInfo.totalItems,
                        maximumExportedResults: MAXIMUM_ITEMS_FOR_BULK_FETCHING,
                    }),
                    translationFunction('notAllResultsExportedTitle'),
                );
            initiateCsvFileDownload(dataForExport, filename);
        }
    };
};
