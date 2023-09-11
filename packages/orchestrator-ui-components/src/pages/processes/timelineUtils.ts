import { ProcessDetailStep, StepStatus } from '../../types';
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

const mapStepToTimelineItem = (step: ProcessDetailStep): TimelineItem => {
    return {
        processStepStatus: step.status,
        onClick: () => {
            // Todo: Implement onClick after step-cards are implemented
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/225
            console.log(`Clicked on ${step.name} (${step.stepid})`);
        },
    };
};

const stepsShouldBeMerged = (
    previousStep: ProcessDetailStep,
    currentStep: ProcessDetailStep,
) =>
    !isFinalStepStatus(previousStep.status) &&
    previousStep.name === currentStep.name;

export const mapProcessStepsToTimelineItems = (steps: ProcessDetailStep[]) =>
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
