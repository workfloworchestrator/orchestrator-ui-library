import React, { useEffect, useRef, useState } from 'react';

import { TimelineItem, WfoError, WfoLoading } from '@/components';

import {
    WfoStepListRef,
    WfoWorkflowStepList,
} from '../../components/WfoWorkflowSteps';
import { GET_PROCESS_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { useQueryWithGraphql } from '../../hooks';
import {
    ProcessDetail,
    ProcessDoneStatuses,
    ProcessStatus,
    Step,
} from '../../types';
import { getProductNamesFromProcess } from '../../utils';
import { WfoProcessDetail } from './WfoProcessDetail';
import {
    convertStepsToGroupedSteps,
    mapGroupedStepsToTimelineItems,
} from './timelineUtils';

export type GroupedStep = {
    steps: Step[];
};

const PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL = 3000;

interface WfoProcessDetailPageProps {
    processId: string;
    processDetailRefetchInterval?: number;
}

export const WfoProcessDetailPage = ({
    processId,
    processDetailRefetchInterval = PROCESS_DETAIL_DEFAULT_REFETCH_INTERVAL,
}: WfoProcessDetailPageProps) => {
    const stepListRef = useRef<WfoStepListRef>(null);
    const [fetchInterval, setFetchInterval] = useState<number | undefined>();
    const [process, setProcess] = useState<ProcessDetail | undefined>();
    const { data, isLoading, isError } = useQueryWithGraphql(
        GET_PROCESS_DETAIL_GRAPHQL_QUERY,
        {
            processId,
        },
        'processDetail',
        { refetchInterval: fetchInterval, refetchOnWindowFocus: false },
    );

    if (isError) {
        if (fetchInterval) {
            setFetchInterval(undefined);
        }
    }

    useEffect(() => {
        const process = data?.processes.page[0];
        // We need to cast here because the backend might return the string in upperCase and
        // toLowerCase() will converts the value type to string
        const lastStatus =
            process?.lastStatus.toLocaleLowerCase() as ProcessStatus;

        const isInProgress = !(
            lastStatus && ProcessDoneStatuses.includes(lastStatus)
        );

        setFetchInterval(
            isInProgress ? processDetailRefetchInterval : undefined,
        );
    }, [data, processDetailRefetchInterval]);

    useEffect(() => {
        const fetchedProcessDetails = data?.processes.page[0];

        if (!process) {
            setProcess(fetchedProcessDetails);
            return;
        }

        const shouldUpdateProcess =
            process.lastStatus != fetchedProcessDetails?.lastStatus ||
            process.lastStep !== fetchedProcessDetails?.lastStep;
        if (shouldUpdateProcess) {
            setProcess(fetchedProcessDetails);
        }
    }, [data, process]);

    const steps = process?.steps ?? [];

    const productNames = getProductNamesFromProcess(process);
    const pageTitle = process?.workflowName || '';
    const isTask = process?.isTask ?? false;
    const groupedSteps: GroupedStep[] = convertStepsToGroupedSteps(steps);
    const timelineItems: TimelineItem[] =
        mapGroupedStepsToTimelineItems(groupedSteps);

    return (
        <WfoProcessDetail
            pageTitle={pageTitle}
            productNames={productNames}
            buttonsAreDisabled={isLoading || isError}
            processDetail={process}
            timelineItems={timelineItems}
            onTimelineItemClick={(id: string) =>
                stepListRef.current?.scrollToStep(id)
            }
            isLoading={isLoading}
            hasError={isError}
        >
            {(isError && <WfoError />) ||
                (isLoading && <WfoLoading />) ||
                (process !== undefined && (
                    <WfoWorkflowStepList
                        ref={stepListRef}
                        processId={process.processId}
                        steps={groupedSteps.flatMap(
                            (groupedStep) => groupedStep.steps,
                        )}
                        userInputForm={process.form}
                        startedAt={process.startedAt}
                        isTask={isTask}
                    />
                )) || <h1>Invalid processId</h1>}
        </WfoProcessDetail>
    );
};
