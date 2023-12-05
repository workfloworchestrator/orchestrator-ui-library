import React, { Ref, useEffect, useState } from 'react';

import { JSONSchema6 } from 'json-schema';
import { useTranslations } from 'next-intl';

import { useRawProcessDetails } from '../../../hooks';
import { Step, StepStatus } from '../../../types';
import { WfoJsonCodeBlock } from '../../WfoJsonCodeBlock/WfoJsonCodeBlock';
import { WfoLoading } from '../../WfoLoading';
import { StepListItem, WfoStepList, WfoStepListRef } from '../WfoStepList';
import { updateStepListItems } from '../stepListUtils';
import { WfoStepListHeader } from './WfoStepListHeader';

export interface WfoWorkflowStepListProps {
    steps: Step[];
    startedAt: string;
    processId: string;
    isTask: boolean;
    userInputForm?: JSONSchema6;
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
                step.status === StepStatus.SUSPEND && userInputForm
                    ? userInputForm
                    : undefined,
        })); // If the step is in the suspend state, we show the user input form

        const [stepListItems, setStepListItems] =
            useState(initialStepListItems);

        useEffect(
            () =>
                setStepListItems((previousStepListItems) =>
                    updateStepListItems(previousStepListItems, steps),
                ),
            [steps],
        );

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
