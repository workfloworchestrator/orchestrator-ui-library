import React from 'react';
import { EuiSpacer, EuiPageHeader } from '@elastic/eui';

import { useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';

interface WFOProcessDetailPageProps {
    processId: string;
}

export const WFOProcessDetailPage = ({
    processId,
}: WFOProcessDetailPageProps) => {
    const { data, isFetching } = useQueryWithGraphql(
        GET_PROCESS_DETAIL_GRAPHQL_QUERY,
        {
            processId,
        },
        'processDetail',
        true,
    );
    console.log(isFetching, data); // Console.log to pass unused var linting rule
    return (
        <>
            <EuiSpacer />
            <EuiPageHeader pageTitle="NAME OF PROCESS" />
            PROCESS DETAIL PAGE: {processId}
        </>
    );
};
