import { Step, StepDetailLevel, StepImportance, StepPresentation, StepStatus } from '@/types';

const presentationMatrix: Record<StepDetailLevel, Record<StepImportance, StepPresentation>> = {
  [StepDetailLevel.HIGH]: {
    [StepImportance.HIGH]: StepPresentation.HIGH,
    [StepImportance.DEFAULT]: StepPresentation.HIGH,
    [StepImportance.LOW]: StepPresentation.STANDARD,
  },
  [StepDetailLevel.STANDARD]: {
    [StepImportance.HIGH]: StepPresentation.HIGH,
    [StepImportance.DEFAULT]: StepPresentation.STANDARD,
    [StepImportance.LOW]: StepPresentation.MINIMAL,
  },
  [StepDetailLevel.MINIMAL]: {
    [StepImportance.HIGH]: StepPresentation.STANDARD,
    [StepImportance.DEFAULT]: StepPresentation.MINIMAL,
    [StepImportance.LOW]: StepPresentation.MINIMAL,
  },
};

export const getDefaultStepPresentation = (
  importance: StepImportance | undefined,
  detailLevel: StepDetailLevel,
): StepPresentation =>
  presentationMatrix[detailLevel][importance ?? StepImportance.DEFAULT]
  ?? presentationMatrix[detailLevel][StepImportance.DEFAULT];

// Steps that need attention (failed last step, running step, step awaiting user input) are never shown as minimal
export const applyPresentationFloor = (
  presentation: StepPresentation,
  step: Step,
  isLastStep: boolean,
  hasUserInputForm: boolean,
): StepPresentation => {
  if (presentation !== StepPresentation.MINIMAL) {
    return presentation;
  }

  const mustBeVisible =
    (isLastStep && step.status === StepStatus.FAILED)
    || step.status === StepStatus.RUNNING
    || (step.status === StepStatus.SUSPEND && hasUserInputForm);

  return mustBeVisible ? StepPresentation.STANDARD : presentation;
};

// Clicking a step expands it one level; clicking a high step shrinks it back to its base presentation.
// A step without content can't be expanded to high, so it shrinks back to minimal directly when that's its base.
export const getNextPresentationOnClick = (
  current: StepPresentation,
  base: StepPresentation,
  canExpandToHigh = true,
): StepPresentation => {
  switch (current) {
    case StepPresentation.MINIMAL:
      return StepPresentation.STANDARD;
    case StepPresentation.STANDARD:
      return canExpandToHigh ? StepPresentation.HIGH : StepPresentation.MINIMAL;
    case StepPresentation.HIGH:
      return base === StepPresentation.HIGH ? StepPresentation.STANDARD : base;
  }
};
