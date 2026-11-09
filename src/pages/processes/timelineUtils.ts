import { TimelineItem } from '../../components';
import { Step, StepStatus } from '../../types';
import { GroupedStep } from './WfoProcessDetailPage';

export const getMostAccurateTimelineStatus = (
  statusPreviousStep: StepStatus,
  statusCurrentStep: StepStatus,
): StepStatus => (statusCurrentStep !== StepStatus.PENDING ? statusCurrentStep : statusPreviousStep);

export const isNonRetryableState = (status: StepStatus): boolean => {
  return status === StepStatus.COMPLETE || status === StepStatus.SUCCESS || status === StepStatus.SKIPPED;
};

export const isFailedStep = (step: Step): boolean => step.status === StepStatus.FAILED;

const stepsShouldBeMerged = (previousStep: Step, currentStep: Step) =>
  !isNonRetryableState(previousStep.status) && previousStep.name === currentStep.name;

export const convertStepsToGroupedSteps = (steps: Step[]): GroupedStep[] =>
  steps.reduce<GroupedStep[]>((previousGroupedSteps: GroupedStep[], currentStep, index, allSteps) => {
    const previousGroupedStep = previousGroupedSteps.slice(-1)[0];

    if (index > 0 && stepsShouldBeMerged(allSteps[index - 1], currentStep)) {
      const allGroupedStepsExceptLast = previousGroupedSteps.slice(0, -1);

      const updatedLastGroupedStep: GroupedStep = {
        steps: [...previousGroupedStep.steps, currentStep],
      };

      return [...allGroupedStepsExceptLast, updatedLastGroupedStep];
    }

    return [
      ...previousGroupedSteps,
      {
        steps: [currentStep],
      },
    ];
  }, []);

const mapStepToTimelineItem = (processDetailStep: Step): TimelineItem => {
  return {
    id: processDetailStep.stepId,
    processStepStatus: processDetailStep.status,
    stepDetail: processDetailStep.name,
  };
};

export const mapGroupedStepToTimelineItem = (groupedStep: GroupedStep): TimelineItem => {
  if (groupedStep.steps.length === 1) {
    return mapStepToTimelineItem(groupedStep.steps[0]);
  }

  return groupedStep.steps.reduce<TimelineItem>(
    (previousTimelineItem: TimelineItem, currentStep): TimelineItem => ({
      ...previousTimelineItem,
      id: currentStep.stepId ?? previousTimelineItem.id,
      processStepStatus: getMostAccurateTimelineStatus(previousTimelineItem.processStepStatus, currentStep.status),
    }),
    {
      ...mapStepToTimelineItem(groupedStep.steps[0]),
      value: groupedStep.steps.filter(isFailedStep).length || undefined,
    },
  );
};

export const mapGroupedStepsToTimelineItems = (groupedSteps: GroupedStep[]): TimelineItem[] =>
  groupedSteps.map(mapGroupedStepToTimelineItem);

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
