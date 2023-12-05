import React, { Ref, useImperativeHandle, useRef } from 'react';

import { JSONSchema6 } from 'json-schema';

import { useOrchestratorTheme } from '../../../hooks';
import { Step } from '../../../types';
import { WfoStep } from '../WfoStep';
import { getStyles } from '../styles';

export type StepListItem = {
    step: Step;
    isExpanded: boolean;
    userInputForm?: JSONSchema6;
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
                    console.error(
                        'Error scrolling to step with stepId ',
                        stepId,
                    );
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
                    const stepComponent = (
                        <div key={`step-${index}`}>
                            {index !== 0 && <div css={stepSpacerStyle} />}
                            <WfoStep
                                ref={getReferenceCallbackForStepId(
                                    stepListItem.step.stepId,
                                )}
                                onToggleStepDetail={() =>
                                    onToggleExpandStepListItem(stepListItem)
                                }
                                stepListItem={stepListItem}
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
