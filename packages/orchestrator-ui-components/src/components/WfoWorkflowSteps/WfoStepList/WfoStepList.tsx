import React, { Ref, useImperativeHandle, useRef } from 'react';

import { getPageTemplateStyles } from '@/components/WfoPageTemplate/WfoPageTemplate/styles';
import { getTimelineStyles } from '@/components/WfoTimeline/styles';
import { useContentRef, useWithOrchestratorTheme } from '@/hooks';
import { FormUserPermissions } from '@/types/forms';

import { WfoStep } from '../WfoStep';
import { getWorkflowStepsStyles } from '../styles';
import { StepListItem } from './../WfoWorkflowStepList';

export type WfoStepListRef = {
    scrollToStep: (stepId: string) => void;
};

export type WfoStepListProps = {
    stepListItems: StepListItem[];
    showHiddenKeys: boolean;
    onToggleExpandStepListItem: (stepListItem: StepListItem) => void;
    onTriggerExpandStepListItem: (stepListItem: StepListItem) => void;
    isTask: boolean;
    processId: string;
    userPermissions: FormUserPermissions;
};

export const WfoStepList = React.forwardRef(
    (
        {
            stepListItems,
            showHiddenKeys,
            onToggleExpandStepListItem,
            onTriggerExpandStepListItem,
            isTask,
            processId,
            userPermissions,
        }: WfoStepListProps,
        reference: Ref<WfoStepListRef>,
    ) => {
        const { NAVIGATION_HEIGHT } = useWithOrchestratorTheme(
            getPageTemplateStyles,
        );
        const { TIMELINE_HEIGHT, TIMELINE_OUTLINE_WIDTH } =
            useWithOrchestratorTheme(getTimelineStyles);
        const { SPACE_BETWEEN_STEPS, stepSpacerStyle } =
            useWithOrchestratorTheme(getWorkflowStepsStyles);
        const scrollOffset =
            NAVIGATION_HEIGHT +
            TIMELINE_HEIGHT +
            TIMELINE_OUTLINE_WIDTH +
            SPACE_BETWEEN_STEPS;

        const stepReferences = useRef(new Map<string, HTMLDivElement>());

        const { contentRef } = useContentRef();

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

                    const targetRect = stepReferences.current
                        .get(stepId)
                        ?.getBoundingClientRect();

                    if (targetRect) {
                        const { top } = targetRect;
                        contentRef?.current?.scrollBy({
                            top: top - scrollOffset,
                            behavior: 'smooth',
                        });
                    }
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
                {stepListItems.map((stepListItem, index) => (
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
                            startedAt={stepListItem.step.started}
                            completedAt={stepListItem.step.completed}
                            showHiddenKeys={showHiddenKeys}
                            isStartStep={index === 0}
                            isTask={isTask}
                            processId={processId}
                            userPermissions={userPermissions}
                        />
                    </div>
                ))}
            </>
        );
    },
);
WfoStepList.displayName = 'WfoStepList';
