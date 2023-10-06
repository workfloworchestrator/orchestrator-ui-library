import React, { Ref, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Step } from '../../../types';
import { WFOStepListHeader } from './WFOStepListHeader';
import { WFOStepsRawJson } from '../WFOStepsRawJson';
import { StepListItem, WFOStepList, WFOStepListRef } from '../WFOStepList';

export interface WFOWorkflowStepListProps {
    steps: Step[];
    startedAt: string;
}

export const WFOWorkflowStepList = React.forwardRef(
    (
        { steps = [], startedAt }: WFOWorkflowStepListProps,
        reference: Ref<WFOStepListRef>,
    ) => {
        const [showHiddenKeys, setShowHiddenKeys] = useState(false);
        const [showRaw, setShowRaw] = useState(false);

        const t = useTranslations('processes.steps');

        const initialStepListItems: StepListItem[] = steps.map((step) => ({
            step,
            isExpanded: false,
        }));
        const [stepListItems, setStepListItems] =
            useState(initialStepListItems);

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

        const toggleExpandedStepListItem = (stepListItem: StepListItem) => {
            setStepListItems(
                stepListItems.map((item) =>
                    item.step === stepListItem.step
                        ? {
                              ...item,
                              isExpanded: !item.isExpanded,
                          }
                        : item,
                ),
            );
        };

        const expandStepListItem = (stepListItem: StepListItem) => {
            setStepListItems(
                stepListItems.map((item) => {
                    if (item.step === stepListItem.step) {
                        return {
                            ...item,
                            isExpanded: true,
                        };
                    }
                    return item;
                }),
            );
        };

        return (
            <>
                <WFOStepListHeader
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
                />

                {showRaw ? (
                    <WFOStepsRawJson steps={steps} />
                ) : (
                    <WFOStepList
                        ref={reference}
                        stepListItems={stepListItems}
                        toggleStepDetailIsOpen={toggleExpandedStepListItem}
                        startedAt={startedAt}
                        showHiddenKeys={showHiddenKeys}
                        onExpandStepListItem={expandStepListItem}
                    />
                )}
            </>
        );
    },
);

WFOWorkflowStepList.displayName = 'WFOWorkflowStepList';
