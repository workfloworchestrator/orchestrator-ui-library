import React, { Ref, useContext, useImperativeHandle, useRef } from 'react';

import { ContentContext } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';

import { WfoStep } from '../WfoStep';
import { getStyles } from '../styles';
import { StepListItem } from './../WfoWorkflowStepList';

export type WfoStepListRef = {
    scrollToStep: (stepId: string) => void;
};

export type WfoStepListProps = {
    stepListItems: StepListItem[];
    showHiddenKeys: boolean;
    startedAt: string;
    onToggleExpandStepListItem: (stepListItem: StepListItem) => void;
    onTriggerExpandStepListItem: (stepListItem: StepListItem) => void;
    isTask: boolean;
    processId: string;
};

export const WfoStepList = React.forwardRef(
    (
        {
            stepListItems,
            showHiddenKeys,
            startedAt,
            onToggleExpandStepListItem,
            onTriggerExpandStepListItem,
            isTask,
            processId,
        }: WfoStepListProps,
        reference: Ref<WfoStepListRef>,
    ) => {
        const { stepSpacerStyle } = useWithOrchestratorTheme(getStyles);

        const stepReferences = useRef(new Map<string, HTMLDivElement>());

        const contentRef = useContext(ContentContext)?.contentRef;

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

                    // Start of custom scrollIntoView
                    const targetRect = stepReferences.current
                        .get(stepId)
                        ?.getBoundingClientRect();

                    if (targetRect) {
                        const { top } = targetRect;
                        contentRef?.current?.scrollBy({
                            top: top - 122, // Timeline height (40) + Offset from top (10) + Space between steps (24) + Fixed menu bar (48)
                            behavior: 'smooth',
                        });
                    }
                    // End of custom scrollIntoView
                } catch {
                    console.error(
                        'Error scrolling to step with stepId ',
                        stepId,
                    );
                }
            },
        }));

        const getReferenceCallbackForStepId =
            (stepId: string) => (node: HTMLDivElement | null) => {
                if (node) {
                    stepReferences.current.set(stepId, node);
                } else if (stepId && stepReferences.current.has(stepId)) {
                    stepReferences.current.delete(stepId);
                }
            };

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
                                isTask={isTask}
                                processId={processId}
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
