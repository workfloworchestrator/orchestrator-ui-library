import { ProcessDetailStep, StepStatus } from '../../types';
import { TimelineItem } from '../../components';

export const getMostAccurateTimelineStatus = (
    statusPreviousStep: StepStatus,
    statusCurrentStep: StepStatus,
): StepStatus =>
    statusCurrentStep !== StepStatus.PENDING
        ? statusCurrentStep
        : statusPreviousStep;

const mapStepToTimelineItem = (step: ProcessDetailStep): TimelineItem => {
    return {
        processStepStatus: step.status,
        onClick: () => {
            console.log(`Clicked on ${step.name} (${step.stepid})`);
        },
    };
};

export const mapProcessStepsToTimelineItems = (steps: ProcessDetailStep[]) =>
    steps.reduce<TimelineItem[]>((acc: TimelineItem[], curr, index, arr) => {
        const previousStep = acc.slice(-1)[0];

        if (index > 0 && arr[index - 1].name === curr.name) {
            const allStepsExceptPrevious = acc.slice(0, -1);
            const updatedPreviousStep: TimelineItem = {
                ...previousStep,
                processStepStatus: getMostAccurateTimelineStatus(
                    previousStep.processStepStatus,
                    curr.status,
                ),
                value:
                    typeof previousStep.value === 'number'
                        ? previousStep.value + 1
                        : 2,
            };

            return [...allStepsExceptPrevious, updatedPreviousStep];
        }

        return [...acc, mapStepToTimelineItem(curr)];
    }, []);
