import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiIcon, EuiLoadingSpinner } from '@elastic/eui';

import { useShowToastMessage, useWithOrchestratorTheme } from '@/hooks';
import { useLazyGetAgentExportQuery } from '@/rtk/endpoints/agentExport';
import { GraphQLPageInfo } from '@/types';
import { getCsvFileNameWithDate } from '@/utils';
import { csvDownloadHandler } from '@/utils/csvDownload';

import { getExportButtonStyles } from './styles';

export type ExportData = {
    action: string;
    download_url: string;
    message: string;
};

export type ExportButtonProps = {
    exportData: ExportData;
};

type ExportApiResponse = {
    page: object[];
    pageInfo?: GraphQLPageInfo;
};

export function ExportButton({ exportData }: ExportButtonProps) {
    const { showToastMessage } = useShowToastMessage();
    const tError = useTranslations('errors');
    const [triggerExport, { isFetching }] = useLazyGetAgentExportQuery();

    const {
        containerStyle,
        buttonWrapperStyle,
        titleStyle,
        fileRowStyle,
        fileInfoStyle,
        filenameStyle,
        downloadButtonStyle,
    } = useWithOrchestratorTheme(getExportButtonStyles);

    const filename = getCsvFileNameWithDate('export');

    const onDownloadClick = async () => {
        const data = await triggerExport(exportData.download_url).unwrap();

        const keyOrder = data.page.length > 0 ? Object.keys(data.page[0]) : [];

        const handleExport = csvDownloadHandler(
            async () => data,
            (data: ExportApiResponse) => data.page,
            (data: ExportApiResponse) =>
                data.pageInfo ?? {
                    totalItems: data.page.length,
                    startCursor: 0,
                    endCursor: data.page.length - 1,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    sortFields: [],
                    filterFields: [],
                },
            keyOrder,
            filename,
            showToastMessage,
            tError,
        );

        await handleExport();
    };

    return (
        <div css={containerStyle}>
            <div css={buttonWrapperStyle}>
                {exportData.message && <div css={titleStyle}>{exportData.message}</div>}
                <div css={fileRowStyle} onClick={onDownloadClick}>
                    <div css={fileInfoStyle}>
                        <EuiIcon type="document" size="m" />
                        <span css={filenameStyle}>{filename}</span>
                    </div>
                    <div css={downloadButtonStyle}>
                        {isFetching ? (
                            <EuiLoadingSpinner size="m" />
                        ) : (
                            <EuiIcon type="download" size="m" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
