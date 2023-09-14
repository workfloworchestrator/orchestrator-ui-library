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
            allTimelineItems: TimelineItem[],
            currentProcessDetailStep,
            index,
            allProcessDetailSteps,
        ) => {
            const previousTimelineItem = allTimelineItems.slice(-1)[0];

            if (
                index > 0 &&
                stepsShouldBeMerged(
                    allProcessDetailSteps[index - 1],
                    currentProcessDetailStep,
                )
            ) {
                const allStepsExceptPrevious = allTimelineItems.slice(0, -1);
                const updatedPreviousStep: TimelineItem = {
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

                return [...allStepsExceptPrevious, updatedPreviousStep];
            }

            return [
                ...allTimelineItems,
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
