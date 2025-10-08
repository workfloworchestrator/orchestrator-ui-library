import React, { Ref, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    WfoJsonCodeBlock,
    WfoLoading,
    WfoStepList,
    WfoStepListHeader,
    WfoStepListRef,
} from '@/components';
import WfoDiff from '@/components/WfoDiff/WfoDiff';
import { WfoTraceback } from '@/components/WfoWorkflowSteps/WfoTraceback/WfoTraceback';
import { useGetRawProcessDetailQuery } from '@/rtk/endpoints/processDetail';
import { ProcessStatus, Step, StepStatus } from '@/types';
import { FormUserPermissions, InputForm } from '@/types/forms';

export type StepListItem = {
    step: Step;
    isExpanded: boolean;
    userInputForm?: InputForm;
};

export interface WfoWorkflowStepListProps {
    steps: Step[];
    lastStatus: ProcessStatus;
    traceBack: string | null;
    startedAt: string;
    processId: string;
    isTask: boolean;
    userInputForm?: InputForm;
    userPermissions: FormUserPermissions;
}

export const WfoProcessRawData = ({ processId }: { processId: string }) => {
    const { data, isFetching } = useGetRawProcessDetailQuery({ processId });
    return isFetching ? <WfoLoading /> : <WfoJsonCodeBlock data={data || {}} />;
};

export const WfoProcessSubscriptionDelta = ({
    processId,
}: {
    processId: string;
}) => {
    const { data, isFetching } = useGetRawProcessDetailQuery({ processId });

    const subscriptionId =
        data?.current_state?.subscription?.subscription_id ?? '';
    const newText = data?.current_state?.subscription ?? null;
    const oldSubscriptions = data?.current_state?.__old_subscriptions__ || {};
    const oldSubscription =
        subscriptionId in oldSubscriptions
            ? oldSubscriptions[subscriptionId]
            : null;
    const oldText = oldSubscription || null;

    return isFetching ? (
        <WfoLoading />
    ) : (
        <WfoDiff
            oldText={oldText ? JSON.stringify(oldText, null, 2) : ''}
            newText={newText ? JSON.stringify(newText, null, 2) : ''}
            syntax="javascript"
        />
    );
};

export const WfoWorkflowStepList = React.forwardRef(
    (
        {
            steps = [],
            lastStatus,
            traceBack,
            processId,
            isTask,
            userInputForm,
            userPermissions,
        }: WfoWorkflowStepListProps,
        reference: Ref<WfoStepListRef>,
    ) => {
        const [showHiddenKeys, setShowHiddenKeys] = useState(false);
        const [showRaw, setShowRaw] = useState(false);
        const [showDelta, setShowDelta] = useState(false);
        const [showTraceback, setShowTraceback] = useState(false);

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
                    isExpanded: previousStepListItem?.isExpanded || false,
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

        // The value of lastStatus is not in lowercase despite the ProcessStatus enum definition
        const isRunningWorkflow: boolean = ![
            ProcessStatus.FAILED,
            ProcessStatus.ABORTED,
            ProcessStatus.COMPLETED,
        ]
            .map((status) => status.toLowerCase())
            .includes(lastStatus.toLowerCase());

        return (
            <>
                <WfoStepListHeader
                    showHiddenKeys={showHiddenKeys}
                    showRaw={showRaw}
                    showDelta={showDelta}
                    showTracebackButton={traceBack !== null}
                    showTraceback={showTraceback}
                    allDetailToggleText={
                        allStepsAreExpanded ? t('collapseAll') : t('expandAll')
                    }
                    onChangeShowHiddenKeys={setShowHiddenKeys}
                    onChangeShowRaw={setShowRaw}
                    onChangeShowDelta={setShowDelta}
                    onToggleAllDetailsIsOpen={() =>
                        setExpandedStateStepListItems(!allStepsAreExpanded)
                    }
                    onShowTraceback={setShowTraceback}
                    isTask={isTask}
                    isRunningWorkflow={isRunningWorkflow}
                />
                {showTraceback && <WfoTraceback>{traceBack}</WfoTraceback>}
                {showRaw && <WfoProcessRawData processId={processId} />}
                {showDelta && (
                    <WfoProcessSubscriptionDelta processId={processId} />
                )}
                {!showRaw && !showDelta && (
                    <WfoStepList
                        ref={reference}
                        stepListItems={stepListItems}
                        showHiddenKeys={showHiddenKeys}
                        isTask={isTask}
                        onToggleExpandStepListItem={
                            toggleExpandedStateStepListItem
                        }
                        processId={processId}
                        onTriggerExpandStepListItem={handleExpandStepListItem}
                        userPermissions={userPermissions}
                    />
                )}
            </>
        );
    },
);

WfoWorkflowStepList.displayName = 'WfoWorkflowStepList';
