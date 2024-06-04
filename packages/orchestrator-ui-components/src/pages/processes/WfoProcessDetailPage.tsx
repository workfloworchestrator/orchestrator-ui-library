import React, { useRef } from 'react';

import { TimelineItem, WfoError, WfoLoading } from '@/components';
import { WfoStepListRef, WfoWorkflowStepList } from '@/components';
import { useGetProcessDetailQuery } from '@/rtk/endpoints/processDetail';
import { Step } from '@/types';
import { getProductNamesFromProcess } from '@/utils';

import { WfoProcessDetail } from './WfoProcessDetail';
import {
    convertStepsToGroupedSteps,
    mapGroupedStepsToTimelineItems,
} from './timelineUtils';

export type GroupedStep = {
    steps: Step[];
};

interface WfoProcessDetailPageProps {
    processId: string;
}

export const WfoProcessDetailPage = ({
    processId,
}: WfoProcessDetailPageProps) => {
    const stepListRef = useRef<WfoStepListRef>(null);

    const { data, isLoading, isError } = useGetProcessDetailQuery({
        processId,
    });
    const processDetail = data?.processes[0];

    const steps = processDetail?.steps ?? [];

    const productNames = getProductNamesFromProcess(processDetail);
    const pageTitle = processDetail?.workflowName || '';
    const isTask = processDetail?.isTask ?? false;
    const groupedSteps: GroupedStep[] = convertStepsToGroupedSteps(steps);
    const timelineItems: TimelineItem[] =
        mapGroupedStepsToTimelineItems(groupedSteps);

    return (
        <WfoProcessDetail
            pageTitle={pageTitle}
            productNames={productNames}
            buttonsAreDisabled={isLoading || isError}
            processDetail={processDetail}
            timelineItems={timelineItems}
            onTimelineItemClick={(id: string) =>
                stepListRef.current?.scrollToStep(id)
            }
            isLoading={isLoading}
            hasError={isError}
        >
            {(isError && <WfoError />) ||
                (isLoading && <WfoLoading />) ||
                (processDetail !== undefined && (
                    <WfoWorkflowStepList
                        ref={stepListRef}
                        processId={processDetail.processId}
                        steps={groupedSteps.flatMap(
                            (groupedStep) => groupedStep.steps,
                        )}
                        traceBack={processDetail.traceback}
                        userInputForm={processDetail.form}
                        startedAt={processDetail.startedAt}
                        isTask={isTask}
                    />
                )) || <h1>Invalid processId</h1>}
        </WfoProcessDetail>
    );
};
