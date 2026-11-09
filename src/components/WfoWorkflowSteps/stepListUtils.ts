import { StepState } from '@/types';

export const STEP_STATE_HIDDEN_KEYS = ['label_', 'divider_', '__', 'confirmation_mail'];
export const getStepContent = (stepDelta: StepState, showHiddenKeys: boolean): StepState => {
  if (showHiddenKeys) {
    return stepDelta;
  }

  return Object.entries(stepDelta)
    .filter(([key]) => !STEP_STATE_HIDDEN_KEYS.some((word) => key.startsWith(word)))
    .reduce<StepState>(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue[0]]: currentValue[1],
      }),
      {},
    );
};
