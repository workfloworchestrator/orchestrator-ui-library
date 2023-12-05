import React, { Ref, useEffect, useState } from 'react';

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
            userInputForm:
                step.status === StepStatus.SUSPEND ? userInputForm : undefined,
        })); // If the step is in the suspend state, we show the user input form

        const [stepListItems, setStepListItems] =
            useState(initialStepListItems);

        const persistStepListItemState = (
            previousStepListItems: StepListItem[],
            updatedSteps: Step[],
        ): StepListItem[] => {
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
                    userInputForm: previousStepListItem
                        ? previousStepListItem.userInputForm
                        : undefined,
                };
            });
        };

        useEffect(() => {
            // We want to preserve the state of stepListItems between renders
            setStepListItems((previousStepListItems) =>
                persistStepListItemState(previousStepListItems, steps),
            );
        }, [steps]);

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
                        onTriggerExpandStepListItem={handleExpandStepListItem}
                    />
                )}
            </>
        );
    },
);

WfoWorkflowStepList.displayName = 'WfoWorkflowStepList';
