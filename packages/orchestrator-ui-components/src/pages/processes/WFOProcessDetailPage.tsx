import React, { useRef } from 'react';

import { getProductNamesFromProcess } from '../../utils';
import { useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { TimelineItem, WFOLoading } from '../../components';

import { WFOProcessDetail } from './WFOProcessDetail';
import {
    WFOWorkflowStepList,
    WFOWorkflowStepListRef,
} from '../../components/WFOSteps';

import {
    convertStepsToGroupedSteps,
    mapGroupedStepsToTimelineItems,
} from './timelineUtils';
import { Step } from '../../types';

export type GroupedStep = {
    steps: Step[];
};

interface WFOProcessDetailPageProps {
    processId: string;
}

export const WFOProcessDetailPage = ({
    processId,
}: WFOProcessDetailPageProps) => {
    const stepListRef = useRef<WFOWorkflowStepListRef>(null);
    const { data, isFetching } = useQueryWithGraphql(
        GET_PROCESS_DETAIL_GRAPHQL_QUERY,
        {
            processId,
        },
        'processDetail',
        true,
    );

    const process = data?.processes.page[0];
    const steps = process?.steps ?? [];

    const productNames = getProductNamesFromProcess(process);
    const pageTitle = isFetching ? '...' : process?.workflowName || '';

    const groupedSteps: GroupedStep[] = convertStepsToGroupedSteps(steps);
    const timelineItems: TimelineItem[] =
        mapGroupedStepsToTimelineItems(groupedSteps);

    return (
        <WFOProcessDetail
            pageTitle={pageTitle}
            productNames={productNames}
            buttonsAreDisabled={isFetching}
            isFetching={isFetching}
            processDetail={process}
            timelineItems={timelineItems}
            onTimelineItemClick={(id: string) =>
                stepListRef.current?.scrollToStep(id)
            }
        >
            {(isFetching && <WFOLoading />) ||
                (process !== undefined && (
                    <WFOWorkflowStepList
                        ref={stepListRef}
                        steps={groupedSteps.flatMap(
                            (groupedStep) => groupedStep.steps,
                        )}
                        startedAt={process.startedAt}
                    />
                ))}
        </WFOProcessDetail>
    );
};
