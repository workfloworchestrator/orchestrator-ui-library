import { Step, StepStatus } from '../../types';
import { TimelineItem } from '../../components';

export const getMostAccurateTimelineStatus = (
    statusPreviousStep: StepStatus,
    statusCurrentStep: StepStatus,
): StepStatus =>
    statusCurrentStep !== StepStatus.PENDING
        ? statusCurrentStep
        : statusPreviousStep;

const isFinalStepStatus = (status: StepStatus): boolean => {
    return (
        status === StepStatus.COMPLETE ||
        status === StepStatus.SUCCESS ||
        status === StepStatus.SKIPPED
    );
};

const mapStepToTimelineItem = (processDetailStep: Step): TimelineItem => {
    return {
        processStepStatus: processDetailStep.status,
        stepDetail: processDetailStep.name,
    };
};

const stepsShouldBeMerged = (previousStep: Step, currentStep: Step) =>
    !isFinalStepStatus(previousStep.status) &&
    previousStep.name === currentStep.name;

export const mapProcessStepsToTimelineItems = (steps: Step[]) =>
    steps.reduce<TimelineItem[]>(
        (
            previousTimelineItems: TimelineItem[],
            currentProcessDetailStep,
            index,
            allSteps,
        ) => {
            const previousTimelineItem = previousTimelineItems.slice(-1)[0];

            if (
                index > 0 &&
                stepsShouldBeMerged(
                    allSteps[index - 1],
                    currentProcessDetailStep,
                )
            ) {
                const allTimelineItemsExceptLast = previousTimelineItems.slice(
                    0,
                    -1,
                );
                const updatedPreviousTimelineItem: TimelineItem = {
                    ...previousTimelineItem,
                    processStepStatus: getMostAccurateTimelineStatus(
                        previousTimelineItem.processStepStatus,
                        currentProcessDetailStep.status,
                    ),
                    value:
                        typeof previousTimelineItem.value === 'number'
                            ? previousTimelineItem.value + 1
                            : 2,
                };

                return [
                    ...allTimelineItemsExceptLast,
                    updatedPreviousTimelineItem,
                ];
            }

            return [
                ...previousTimelineItems,
                mapStepToTimelineItem(currentProcessDetailStep),
            ];
        },
        [],
    );

export const getIndexOfCurrentStep = (timelineItems: TimelineItem[]) => {
    const reversedTimelineItems = [...timelineItems].reverse();
    const reversedIndexOfCurrentStep = reversedTimelineItems.findIndex(
        (timelineItem) => timelineItem.processStepStatus === StepStatus.RUNNING,
    );

    if (reversedIndexOfCurrentStep !== -1) {
        return timelineItems.length - reversedIndexOfCurrentStep - 1;
    }

    const indexOfFirstPending = timelineItems.findIndex(
        (timelineItem) => timelineItem.processStepStatus === StepStatus.PENDING,
    );

    if (indexOfFirstPending !== -1) {
        return indexOfFirstPending - 1;
    }

    return timelineItems.length - 1;
};
