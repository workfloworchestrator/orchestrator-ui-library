import React, { Ref, useImperativeHandle, useRef } from 'react';
import { Step, StepStatus } from '../../../types';
import { useOrchestratorTheme } from '../../../hooks';
import { getStyles } from '../styles';
import { stateDelta } from '../../../utils';
import { WfoStep } from '../WfoStep';

export type StepListItem = {
    step: Step;
    isExpanded: boolean;
};

export type WfoStepListRef = {
    scrollToStep: (stepId: string) => void;
};

export type WfoStepListProps = {
    stepListItems: StepListItem[];
    showHiddenKeys: boolean;
    startedAt: string;
    onToggleExpandStepListItem: (stepListItem: StepListItem) => void;
    onTriggerExpandStepListItem: (stepListItem: StepListItem) => void;
};

export const WfoStepList = React.forwardRef(
    (
        {
            stepListItems,
            showHiddenKeys,
            startedAt,
            onToggleExpandStepListItem,
            onTriggerExpandStepListItem,
        }: WfoStepListProps,
        reference: Ref<WfoStepListRef>,
    ) => {
        const { theme } = useOrchestratorTheme();
        const { stepSpacerStyle } = getStyles(theme);

        const stepReferences = useRef(new Map<string, HTMLDivElement>());

        let stepStartTime = startedAt;

        useImperativeHandle(reference, () => ({
            scrollToStep: async (stepId: string) => {
                // Applied a promise construction to wait for the browser to expand the step before scrolling
                try {
                    await new Promise((resolve, reject) => {
                        const foundStepListItem = stepListItems.find(
                            (value) => value.step.stepId === stepId,
                        );

                        if (!foundStepListItem) {
                            return reject(undefined);
                        }

                        return resolve(
                            onTriggerExpandStepListItem(foundStepListItem),
                        );
                    });
                    stepReferences.current.get(stepId)?.scrollIntoView({
                        behavior: 'smooth',
                    });
                } catch {
                    console.log('Error scrolling to step with stepId ', stepId);
                }
            },
        }));

        const getReferenceCallbackForStepId =
            (stepId: string) => (node: HTMLDivElement | null) =>
                node
                    ? stepReferences.current.set(stepId, node)
                    : stepReferences.current.delete(stepId);

        return (
            <>
                {stepListItems.map((stepListItem, index) => {
                    let previousState = {};
                    let delta = {};

                    if (index > 0) {
                        // Todo: decided if we want this here. A refactor would be nice, or move to global state.
                        //  V1 has a rather big case statement with business logic here
                        if (stepListItem.step.status === StepStatus.SUCCESS) {
                            // Prepare a delta with the last successful stepListItem
                            let previousIndex = index - 1;
                            const previousStep =
                                stepListItems[previousIndex].step;
                            while (
                                previousIndex > 0 &&
                                (previousStep.status === StepStatus.FAILED ||
                                    previousStep.status === StepStatus.WAITING)
                            ) {
                                previousIndex--;
                            }
                            previousState = previousStep.state;
                            delta = stateDelta(
                                previousState,
                                stepListItem.step.state,
                            );
                        }

                        if (
                            stepListItem.step.status === StepStatus.WAITING ||
                            stepListItem.step.status === StepStatus.FAILED
                        ) {
                            // Pass complete state as a waiting stepListItem has separate state
                            delta = stepListItem.step.state;
                        }
                    } else {
                        // Todo: handle failed first step (seems to be special)
                        delta = stepListItem.step.state;
                    }

                    const stepComponent = (
                        <div key={`step-${index}`}>
                            {index !== 0 && <div css={stepSpacerStyle} />}
                            <WfoStep
                                ref={getReferenceCallbackForStepId(
                                    stepListItem.step.stepId,
                                )}
                                stepDetailIsOpen={stepListItem.isExpanded}
                                onToggleStepDetail={() =>
                                    onToggleExpandStepListItem(stepListItem)
                                }
                                step={stepListItem.step}
                                stepDelta={delta}
                                startedAt={stepStartTime}
                                showHiddenKeys={showHiddenKeys}
                                isStartStep={index === 0}
                            />
                        </div>
                    );

                    if (index > 0) {
                        stepStartTime = stepListItem.step.executed;
                    }
                    return stepComponent;
                })}
            </>
        );
    },
);
WfoStepList.displayName = 'WfoStepList';
