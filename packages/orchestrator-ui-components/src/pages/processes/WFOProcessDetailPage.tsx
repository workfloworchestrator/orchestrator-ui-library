import React from 'react';

import { getProductNamesFromProcess } from '../../utils';
import { useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { TimelineItem, WFOLoading } from '../../components';

import { WFOProcessDetail } from './WFOProcessDetail';
import { WFOStepList } from '../../components/WFOSteps';

import { mapProcessStepsToTimelineItems } from './timelineUtils';

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

    const process = data?.processes.page[0];

    const timelineItems: TimelineItem[] = process?.steps
        ? mapProcessStepsToTimelineItems(process.steps)
        : [];

    const productNames = getProductNamesFromProcess(process);
    const pageTitle = isFetching ? '...' : process?.workflowName || '';

    return (
        <WFOProcessDetail
            pageTitle={pageTitle}
            productNames={productNames}
            buttonsAreDisabled={isFetching}
            isFetching={isFetching}
            processDetail={process}
            timelineItems={timelineItems}
        >
            {(isFetching && <WFOLoading />) ||
                (process !== undefined && (
                    <WFOStepList
                        steps={process.steps}
                        startedAt={process.startedAt}
                    />
                ))}
        </WFOProcessDetail>
    );
};
