import React, { useContext, useRef } from 'react';

import { getProductNamesFromProcess } from '../../utils';
import { useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { TimelineItem, WFOLoading } from '../../components';

import { WFOProcessDetail } from './WFOProcessDetail';
import {
    WFOStepListRef,
    WFOWorkflowStepList,
} from '../../components/WFOWorkflowSteps';

import {
    convertStepsToGroupedSteps,
    mapGroupedStepsToTimelineItems,
} from './timelineUtils';
import { Step } from '../../types';
import { OrchestratorConfigContext } from '../../contexts';

export type GroupedStep = {
    steps: Step[];
};

interface WFOProcessDetailPageProps {
    processId: string;
}

export const WFOProcessDetailPage = ({
    processId,
}: WFOProcessDetailPageProps) => {
    const { dataRefetchInterval } = useContext(OrchestratorConfigContext);
    const stepListRef = useRef<WFOStepListRef>(null);
    const { data, isFetching } = useQueryWithGraphql(
        GET_PROCESS_DETAIL_GRAPHQL_QUERY,
        {
            processId,
        },
        'processDetail',
        dataRefetchInterval.processDetail,
    );

    const process = data?.processes.page[0];
    const steps = process?.steps ?? [];

    const productNames = getProductNamesFromProcess(process);
    const pageTitle = process?.workflowName || '';

    const groupedSteps: GroupedStep[] = convertStepsToGroupedSteps(steps);
    const timelineItems: TimelineItem[] =
        mapGroupedStepsToTimelineItems(groupedSteps);

    return (
        <WFOProcessDetail
            pageTitle={pageTitle}
            productNames={productNames}
            buttonsAreDisabled={isFetching && !process}
            processDetail={process}
            timelineItems={timelineItems}
            onTimelineItemClick={(id: string) =>
                stepListRef.current?.scrollToStep(id)
            }
        >
            {(isFetching && !process && <WFOLoading />) ||
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
