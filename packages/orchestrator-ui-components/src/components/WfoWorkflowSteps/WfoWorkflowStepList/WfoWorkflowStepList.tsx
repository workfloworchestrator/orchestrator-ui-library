import React, { Ref, use, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { WfoJsonCodeBlock, WfoLoading } from '@/components';
import { useRawProcessDetails } from '@/hooks';
import { Step, StepStatus } from '@/types';
import { InputForm } from '@/types/forms';

import { WfoStepList, WfoStepListRef } from '../WfoStepList';
import { WfoStepListHeader } from './WfoStepListHeader';

export type StepListItem = {
    step: Step;
    isExpanded: boolean;
    userInputForm?: InputForm;
};

export interface WfoWorkflowStepListProps {
    steps: Step[];
    startedAt: string;
    processId: string;
    isTask: boolean;
    userInputForm?: InputForm;
}

export const WfoProcessRawData = ({ processId }: { processId: string }) => {
    const { data, isFetching } = useRawProcessDetails(processId);
    return isFetching ? <WfoLoading /> : <WfoJsonCodeBlock data={data || {}} />;
};

export const WfoWorkflowStepList = React.forwardRef(
    (
        {
            steps = [],
            startedAt,
            processId,
            isTask,
            userInputForm,
        }: WfoWorkflowStepListProps,
        reference: Ref<WfoStepListRef>,
    ) => {
        const [showHiddenKeys, setShowHiddenKeys] = useState(false);
        const [showRaw, setShowRaw] = useState(false);

        const t = useTranslations('processes.steps');

        const initialStepListItems: StepListItem[] = steps.map((step) => ({
            step,
            isExpanded: false,
        })); // If the step is in the suspend state, we show the user input form

        const [stepListItems, setStepListItems] =
            useState(initialStepListItems);

        const persistStepListItemState = (
            previousStepListItems: StepListItem[],
            updatedSteps: Step[],
            userInputForm?: InputForm,
        ): StepListItem[] => {
            const reversedSteps = [...updatedSteps].reverse();
            const lastStepWithSuspendStatusStepId = reversedSteps.find(
                (step) => step.status === StepStatus.SUSPEND,
            )?.stepId;

            return updatedSteps.map((step) => {
                const previousStepListItem = previousStepListItems.find(
                    (previousStepListItem) =>
                        previousStepListItem.step.stepId === step.stepId,
                );
                return {
                    step,
                    isExpanded: previousStepListItem
                        ? previousStepListItem.isExpanded
                        : false,
                    userInputForm:
                        lastStepWithSuspendStatusStepId === step.stepId &&
                        userInputForm
                            ? userInputForm
                            : undefined,
                };
            });
        };

        useEffect(() => {
            // We want to preserve the state of stepListItems between renders
            setStepListItems((previousStepListItems) =>
                persistStepListItemState(
                    previousStepListItems,
                    steps,
                    userInputForm,
                ),
            );
        }, [steps, userInputForm]);

        const updateStepListItem = (
            stepListItemToUpdate: StepListItem,
            updateFunction: (stepListItem: StepListItem) => StepListItem,
        ) =>
            setStepListItems(
                stepListItems.map((stepListItem) =>
                    stepListItem === stepListItemToUpdate
                        ? updateFunction(stepListItem)
                        : stepListItem,
                ),
            );

        const allStepsAreExpanded = stepListItems.every(
            (item) => item.isExpanded,
        );

        const setExpandedStateStepListItems = (isExpanded: boolean) => {
            setStepListItems(
                stepListItems.map((item) => ({
                    ...item,
                    isExpanded,
                })),
            );
        };

        const toggleExpandedStateStepListItem = (stepListItem: StepListItem) =>
            updateStepListItem(stepListItem, (item) => ({
                ...item,
                isExpanded: !item.isExpanded,
            }));

        const handleExpandStepListItem = (stepListItem: StepListItem) =>
            updateStepListItem(stepListItem, (item) => ({
                ...item,
                isExpanded: true,
            }));

        return (
            <>
                <WfoStepListHeader
                    showHiddenKeys={showHiddenKeys}
                    showRaw={showRaw}
                    allDetailToggleText={
                        allStepsAreExpanded ? t('collapseAll') : t('expandAll')
                    }
                    onChangeShowHiddenKeys={setShowHiddenKeys}
                    onChangeShowRaw={setShowRaw}
                    onToggleAllDetailsIsOpen={() =>
                        setExpandedStateStepListItems(!allStepsAreExpanded)
                    }
                    isTask={isTask}
                />

                {showRaw ? (
                    <WfoProcessRawData processId={processId} />
                ) : (
                    <WfoStepList
                        ref={reference}
                        stepListItems={stepListItems}
                        startedAt={startedAt}
                        showHiddenKeys={showHiddenKeys}
                        isTask={isTask}
                        onToggleExpandStepListItem={
                            toggleExpandedStateStepListItem
                        }
                        processId={processId}
                        onTriggerExpandStepListItem={handleExpandStepListItem}
                    />
                )}
            </>
        );
    },
);

WfoWorkflowStepList.displayName = 'WfoWorkflowStepList';
