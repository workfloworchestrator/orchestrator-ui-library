import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiText } from '@elastic/eui';

import { useShowToastMessage } from '@/hooks';
import { useLazyGetAgentExportQuery } from '@/rtk/endpoints/agentExport';
import { GraphQLPageInfo } from '@/types';
import { getCsvFileNameWithDate } from '@/utils';
import { csvDownloadHandler } from '@/utils/csvDownload';

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
            getCsvFileNameWithDate(`export`),
            showToastMessage,
            tError,
        );

        await handleExport();
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
            }}
        >
            <EuiButton
                onClick={onDownloadClick}
                isLoading={isFetching}
                iconType="download"
                fill
            >
                {exportData.message && (
                    <EuiText size="s" textAlign="center">
                        {exportData.message}
                    </EuiText>
                )}
            </EuiButton>
        </div>
    );
}
