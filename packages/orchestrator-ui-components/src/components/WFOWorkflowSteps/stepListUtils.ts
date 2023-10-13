import { Step, StepState } from '../../types';
import { StepListItem } from './WFOStepList';

export const STEP_STATE_HIDDEN_KEYS = [
    'label_',
    'divider_',
    '__',
    'confirmation_mail',
];
export const getStepContent = (
    stepDelta: StepState,
    showHiddenKeys: boolean,
): StepState => {
    if (showHiddenKeys) {
        return stepDelta;
    }

    return Object.entries(stepDelta)
        .filter(
            ([key]) =>
                !STEP_STATE_HIDDEN_KEYS.some((word) => key.startsWith(word)),
        )
        .reduce<StepState>(
            (previousValue, currentValue) => ({
                ...previousValue,
                [currentValue[0]]: currentValue[1],
            }),
            {},
        );
};

export const updateStepListItems = (
    previousStepListItems: StepListItem[],
    updatedSteps: Step[],
) => {
    const currentExpandedStateByStepId = previousStepListItems.reduce<
        Map<string, boolean>
    >(
        (previousValue, currentValue) =>
            previousValue.set(
                currentValue.step.stepId,
                currentValue.isExpanded,
            ),
        new Map(),
    );

    return updatedSteps.map((step) => {
        const isCurrentlyExpanded = currentExpandedStateByStepId.get(
            step.stepId,
        );
        return {
            step,
            isExpanded: isCurrentlyExpanded ?? false,
        };
    });
};
