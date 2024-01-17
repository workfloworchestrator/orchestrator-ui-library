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

export const csvDownloadHandler =
    <T extends object, U extends object>(
        dataFetchFunction: () => Promise<T | undefined>,
        dataMapper: (data: T) => U[],
        filename: string,
    ) =>
    async () => {
        const data: T | undefined = await dataFetchFunction();

        if (data) {
            const dataForExport = dataMapper(data);
            initiateCsvFileDownload(dataForExport, filename);
        }
    };
