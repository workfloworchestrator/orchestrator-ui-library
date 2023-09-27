import React from 'react';

import { getProductNamesFromProcess } from '../../utils';
import { useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_DETAIL_GRAPHQL_QUERY } from '../../graphqlQueries';
import { TimelineItem, WFOLoading } from '../../components';

import { WFOProcessDetail } from './WFOProcessDetail';
import { WFOStepList } from '../../components/WFOSteps';

import { mapProcessStepsToTimelineItems } from './timelineUtils';
import { Step, StepStatus } from '../../types';

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
    const steps = process?.steps ?? [];

    const timelineItems: TimelineItem[] = mapProcessStepsToTimelineItems(steps);

    const productNames = getProductNamesFromProcess(process);
    const pageTitle = isFetching ? '...' : process?.workflowName || '';

    type GroupedStep = {
        steps: Step[];
        // ref: React.RefObject<HTMLDivElement>;
    };

    // Todo move to utils -- currently in packages/orchestrator-ui-components/src/pages/processes/timelineUtils.ts
    const isFinalStepStatus = (status: StepStatus): boolean => {
        return (
            status === StepStatus.COMPLETE ||
            status === StepStatus.SUCCESS ||
            status === StepStatus.SKIPPED
        );
    };
    // Todo move to utils -- currently in packages/orchestrator-ui-components/src/pages/processes/timelineUtils.ts
    const stepsShouldBeMerged = (previousStep: Step, currentStep: Step) =>
        !isFinalStepStatus(previousStep.status) &&
        previousStep.name === currentStep.name;

    const groupedSteps: GroupedStep[] = steps.reduce<GroupedStep[]>(
        (previousGroupedSteps: GroupedStep[], currentStep, index, allSteps) => {
            const previousGroupedStep = previousGroupedSteps.slice(-1)[0];

            if (
                index > 0 &&
                stepsShouldBeMerged(allSteps[index - 1], currentStep)
            ) {
                const allGroupedStepsExceptLast = previousGroupedSteps.slice(
                    0,
                    -1,
                );

                const updatedLastGroupedStep: GroupedStep = {
                    // ref: previousGroupedStep.ref,
                    steps: [...previousGroupedStep.steps, currentStep],
                };

                return [...allGroupedStepsExceptLast, updatedLastGroupedStep];
            }

            return [
                ...previousGroupedSteps,
                {
                    // Todo: react throws warning: the order of the hooks is not consistent
                    // ref: useRef<HTMLDivElement>(null),
                    steps: [currentStep],
                },
            ];
        },
        [],
    );

    console.log('Detail Page', {
        timelineItems: { timelineItems, length: timelineItems.length },
        steps: {
            steps: {
                processSteps: process?.steps,
                length: process?.steps.length,
            },
        },
        groupedSteps: {
            groupedSteps,
            length: groupedSteps.length,
            flatMapped: groupedSteps.flatMap(
                (groupedStep) => groupedStep.steps,
            ),
        },
    });

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
                        steps={groupedSteps.flatMap(
                            (groupedStep) => groupedStep.steps,
                        )}
                        startedAt={process.startedAt}
                    />
                ))}
        </WFOProcessDetail>
    );
};
