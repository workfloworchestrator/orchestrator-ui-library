import React from 'react';
import { EuiSpacer, EuiPageHeader } from '@elastic/eui';

interface WFOProcessDetailPageProps {
    processId: string;
}

export const WFOProcessDetailPage = ({
    processId,
}: WFOProcessDetailPageProps) => {
    return (
        <>
            <EuiSpacer />
            <EuiPageHeader pageTitle="NAME OF PROCESS" />
            PROCESS DETAIL PAGE: {processId}
        </>
    );
};
